import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import 'dotenv/config';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY_PATH = path.resolve(process.cwd(), "apikey.txt");
const PEXELS_API_KEY_PATH = path.resolve(process.cwd(), "pexels_apikey.txt");
const KEYWORD_PATH = path.resolve(process.cwd(), "keyword.txt");
const BATCH_KEYWORD_PATH = path.resolve(process.cwd(), "keyword-batch.txt");
const OUTPUT_PATH = path.resolve(process.cwd(), "public", "articles.json");
const CACHE_FILE = path.resolve(process.cwd(), ".generate-cache.json");

const BACKDATE_DAYS = parseInt(process.env.BACKDATE_DAYS) || 3;
const FUTURE_SCHEDULE_DAYS = parseInt(process.env.FUTURE_SCHEDULE_DAYS) || 30;
const REQUEST_DELAY_MS = 10000;
const API_CALL_DELAY_MS = 10000;
const GEMINI_MODEL = "gemini-2.5-pro";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// CACHE SYSTEM - INCREMENTAL GENERATION
async function loadCache() {
  try {
    const cacheContent = await fs.readFile(CACHE_FILE, "utf-8");
    return JSON.parse(cacheContent);
  } catch (e) {
    console.log('[CACHE] No cache found, creating new...');
    return { generatedKeywords: [], lastHash: '' };
  }
}

async function saveCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function getKeywordsHash(keywordsContent) {
  let hash = 0;
  for (let i = 0; i < keywordsContent.length; i++) {
    const char = keywordsContent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

function getNewKeywords(currentKeywords, cache) {
  const existingKeywords = cache.generatedKeywords || [];
  return currentKeywords.filter(keyword => 
    !existingKeywords.includes(keyword.trim())
  );
}

// INCREMENTAL GENERATE MAIN FUNCTION - FIXED VERSION
async function incrementalGenerate() {
  console.log('🔍 Starting incremental content generation...');
  
  try {
    let keywords = [];
    let isBatch = false;

    // Check for batch file first (batch processing mode)
    try {
      await fs.access(BATCH_KEYWORD_PATH);
      const batchKeywordsContent = await fs.readFile(BATCH_KEYWORD_PATH, "utf-8");
      const batchKeywords = batchKeywordsContent.split('\n').map(k => k.trim()).filter(k => k.length > 0);
      
      if (batchKeywords.length > 0) {
        console.log(`📦 Batch mode: Processing ${batchKeywords.length} keywords`);
        keywords = batchKeywords;
        isBatch = true;
      }
    } catch (error) {
      // Batch file doesn't exist, try normal keyword.txt
    }

    // If no batch keywords, try normal keyword.txt
    if (keywords.length === 0) {
      try {
        const keywordsContent = await fs.readFile(KEYWORD_PATH, "utf-8");
        keywords = keywordsContent.split('\n').map(k => k.trim()).filter(k => k.length > 0);
        
        if (keywords.length === 0) {
          console.log('⏭️  keyword.txt is empty, skipping content generation');
          return { generated: 0, skipped: 0, reason: 'no_keywords' };
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log('⏭️  keyword.txt not found, skipping content generation');
          return { generated: 0, skipped: 0, reason: 'no_keywords' };
        }
        throw error;
      }
    }

    if (keywords.length === 0) {
      console.log('⏭️  No keywords found, skipping content generation');
      return { generated: 0, skipped: 0, reason: 'no_keywords' };
    }
    
    // Continue with cache logic
    const cache = await loadCache();
    const keywordsContent = keywords.join('\n');
    const currentHash = getKeywordsHash(keywordsContent);
    
    // Only skip if not in batch mode and no changes
    if (!isBatch && currentHash === cache.lastHash) {
      console.log('✅ No changes in keywords, skipping content generation');
      return { generated: 0, skipped: keywords.length, reason: 'no_changes' };
    }
    
    const newKeywords = getNewKeywords(keywords, cache);
    const existingKeywords = cache.generatedKeywords || [];
    
    console.log(`📝 New keywords to generate: ${newKeywords.length}`);
    console.log(`📁 Existing keywords: ${existingKeywords.length}`);
    
    if (newKeywords.length === 0) {
      console.log('💤 No new keywords to generate');
      cache.lastHash = currentHash;
      await saveCache(cache);
      return { generated: 0, skipped: existingKeywords.length, reason: 'no_new_keywords' };
    }
    
    // Generate content for new keywords
    let generatedCount = 0;
    
    const rawApiKeyContent = await fs.readFile(API_KEY_PATH, "utf-8");
    const apiKeys = rawApiKeyContent.split('\n').filter(key => key.trim().startsWith("AIzaSy"));
    if (apiKeys.length === 0) throw new Error("Tidak ada kunci API valid di apikey.txt.");
    
    const pexelsApiKey = await fs.readFile(PEXELS_API_KEY_PATH, "utf-8").catch(() => {
      console.warn("[WARN] pexels_apikey.txt tidak ditemukan. Pencarian gambar akan dilewati.");
      return null;
    }).then(key => key ? key.trim() : null);

    const apiKeyManager = new ApiKeyManager(apiKeys);
    
    let allArticles = [];
    try {
      allArticles = JSON.parse(await fs.readFile(OUTPUT_PATH, "utf-8"));
      console.log(`📚 Loaded ${allArticles.length} existing articles`);
    } catch (e) {
      console.log('[INFO] articles.json tidak ditemukan, membuat yang baru...');
      allArticles = [];
    }
    
    generatedCount = await processNewKeywords(newKeywords, apiKeyManager, pexelsApiKey, allArticles);
    
    // Update cache with new keywords
    cache.generatedKeywords = [...new Set([...existingKeywords, ...newKeywords])];
    cache.lastHash = currentHash;
    await saveCache(cache);
    
    console.log(`🎉 Generated ${generatedCount} new articles`);
    console.log(`📊 Total keywords in cache: ${cache.generatedKeywords.length}`);
    console.log(`📚 Total articles: ${allArticles.length}`);
    
    return { generated: generatedCount, skipped: existingKeywords.length, reason: 'success', isBatch };
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⏭️  keyword files not found, skipping content generation');
      return { generated: 0, skipped: 0, reason: 'no_keywords' };
    }
    console.error('❌ Error during incremental generation:', error);
    throw error;
  }
}

// EXISTING FUNCTIONS - NO CHANGES
const getAnalysisPrompt = (keyword) => `
  Analyze the user keyword: "${keyword}".
  Your task is to act as an award-winning content strategist and return a single, valid JSON object.
  Your goal is to find a UNIQUE ANGLE to make the resulting article stand out from the thousands of other articles on this topic.
  
  Return a JSON object with these exact keys:
  - "suggestedTitle": A highly creative, curiosity-driven, SEO-friendly title that reflects the unique angle. Avoid generic titles.
  - "primaryCategory": The single most relevant high-level category (e.g., "Technology", "Travel", "Health").
  - "categorySlug": A URL-friendly version of the primaryCategory.
  - "persona": The ideal author persona for this specific angle (e.g., "A skeptical tech reviewer", "A seasoned world traveler sharing secrets").
  - "uniqueAngle": A one-sentence summary of the specific, non-obvious viewpoint this article will take. For example, instead of just "Benefits of Meditation", the angle could be "Focusing on how meditation can specifically improve financial decision-making".
  - "hookIntro": A short, compelling opening paragraph (2-3 sentences) to grab the reader's attention, based on the unique angle. This will be used to start the article.
`;

const getContentPrompt = (keyword, analysis, date) => `
  Act as: "${analysis.persona}".
  Your mission is to write a high-quality, thought-provoking article based on a very specific creative brief.

  **Creative Brief:**
  - **Main Title:** "${analysis.suggestedTitle}"
  - **Unique Viewpoint:** You MUST write the entire article from this angle: "${analysis.uniqueAngle}". Do NOT write a generic overview.
  - **Opening Hook:** Start the article's summary section IMMEDIATELY with this paragraph: "${analysis.hookIntro}"

  **Mandatory Rules for Uniqueness:**
  1.  **Use Analogies:** Throughout the "deepDive" and "importance" sections, you must use at least two unique analogies or metaphors to explain complex points.
  2.  **Avoid Clichés:** Do not use overused phrases. Be original in your expression.
  3.  **Actionable Insights:** Ensure your points are not just theoretical but provide clear, actionable advice that is not commonly found elsewhere.
  4.  **Confident Tone:** Write with authority and conviction, guided by your persona.

  **Output Format:**
  Return a single, valid JSON object with the exact keys: "slug", "term", "date", "category", "categorySlug", "tags", "isPopular", "summary", "deepDive", "importance", an array of "prosCons", and an array of "faq".
  
  **Content Details:**
  - The "summary" MUST start with the "Opening Hook" provided in the brief.
  - The "deepDive" and "importance" values MUST be in valid Markdown format with their own creative "##" headings. Their combined word count must exceed 800 words.
  - "slug": A URL-friendly version of the term "${keyword}".
  - "term": Must be exactly "${analysis.suggestedTitle}".
  - "date": Must be exactly "${date}".
  - "category": Must be exactly "${analysis.primaryCategory}".
  - "categorySlug": Must be exactly "${analysis.categorySlug}".
  - "tags": An array of 3-5 relevant lowercase strings.
  - "isPopular": A boolean value.
`;

const getUniquenessPrompt = (text, persona) => `
  Act as a master editor with the persona of "${persona}".
  Your single most important task is to rewrite the following text to make it 100% unique and pass plagiarism checks.

  **Mandatory Rules:**
  1.  **Preserve Core Meaning:** The key facts and intended message MUST be preserved.
  2.  **Radically Alter Sentence Structures:** Do not reuse sentence structures from the original. If the original starts with the subject, you start with a clause or phrase. Vary sentence length dramatically.
  3.  **Aggressively Replace Vocabulary:** Substitute generic nouns, verbs, and adjectives with more vivid, specific, and less common synonyms, while staying true to the persona.
  4.  **Re-order Concepts:** If a paragraph presents ideas in the order A, B, C, try reordering them to C, A, B, if it still makes logical sense.
  5.  **Maintain Persona:** The final text must sound natural for the given persona.

  **Original Text to Rewrite:**
  ---
  ${text}
  ---

  **Your 100% Unique Rewrite:**
`;

function extractJson(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn("   -> [WARN] Tidak ditemukan blok JSON dalam respons.");
      return null;
    }
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("   -> [ERROR] Gagal mem-parsing JSON:", error.message);
    return null;
  }
}

class ApiKeyManager {
  constructor(apiKeys) {
    if (!apiKeys || apiKeys.length === 0) {
      throw new Error("Daftar kunci API tidak boleh kosong.");
    }
    this.models = apiKeys.map(key => 
      new GoogleGenerativeAI(key).getGenerativeModel({ model: GEMINI_MODEL })
    );
    this.currentIndex = 0;
    console.log(`[INFO] ApiKeyManager diinisialisasi dengan ${this.models.length} kunci.`);
  }

  async generate(prompt) {
    const totalKeys = this.models.length;
    for (let i = 0; i < totalKeys; i++) {
      const modelIndex = (this.currentIndex + i) % totalKeys;
      const model = this.models[modelIndex];
      
      try {
        console.log(`   -> Mencoba dengan Kunci API #${modelIndex + 1}...`);
        const result = await model.generateContent(prompt);
        this.currentIndex = (modelIndex + 1) % totalKeys;
        return result;
      } catch (e) {
        let detailedError = e.message;
        if (e.message.includes('429')) {
            detailedError = "HTTP 429: Rate Limit Exceeded. Terlalu banyak permintaan dalam waktu singkat.";
        } else if (e.message.includes('API key not valid')) {
            detailedError = "HTTP 400: Kunci API tidak valid atau formatnya salah.";
        } else if (e.message.includes('permission')) {
            detailedError = "HTTP 403: Permission Denied. Periksa apakah API diaktifkan dan akun penagihan tertaut ke proyek.";
        }
        console.warn(`   -> [WARN] Kunci API #${modelIndex + 1} gagal. Detail: ${detailedError}`);
        
        if (i < totalKeys - 1) {
          console.log("   -> Mencoba dengan kunci berikutnya...");
        }
      }
    }
    throw new Error("Semua kunci API yang tersedia gagal untuk tugas ini.");
  }
}

async function uniquenessBooster(text, persona, apiKeyManager) {
  if (!text) return "";
  console.log(`   -> Menerapkan Uniqueness Booster...`);
  try {
    const prompt = getUniquenessPrompt(text, persona);
    const result = await apiKeyManager.generate(prompt);
    await delay(API_CALL_DELAY_MS);
    return result.response.text();
  } catch (error) {
    console.warn(`   -> [WARN] Uniqueness Booster gagal. Mengembalikan teks asli. Error: ${error.message}`);
    return text;
  }
}

async function fetchImageFromPexels(keyword, pexelsApiKey) {
    if (!pexelsApiKey) {
        console.warn("   -> WARN: Pexels API key not found. Skipping image search.");
        return null;
    }
    try {
        console.log(` -> Mencari gambar dengan kata kunci: "${keyword}"`);
        const response = await axios.get(`https://api.pexels.com/v1/search`, {
            headers: { Authorization: pexelsApiKey },
            params: { query: keyword, per_page: 1, orientation: 'landscape' }
        });
        if (response.data.photos && response.data.photos.length > 0) {
            const imageUrl = response.data.photos[0].src.large;
            console.log(`   -> Gambar ditemukan: ${imageUrl}`);
            return imageUrl;
        } else {
            console.warn(`   -> WARN: Tidak ada gambar ditemukan di Pexels untuk "${keyword}".`);
            return null;
        }
    } catch (error) {
        console.error(`   -> ERROR: Gagal mengambil gambar dari Pexels. ${error.message}`);
        return null;
    }
}

async function processNewKeywords(keywordsToGenerate, apiKeyManager, pexelsApiKey, allArticles) {
    console.log(`\n[INFO] Memproses ${keywordsToGenerate.length} kata kunci baru...`);
    
    const totalScheduleSpan = BACKDATE_DAYS + FUTURE_SCHEDULE_DAYS;
    const postsPerDay = Math.ceil(keywordsToGenerate.length / totalScheduleSpan) || 1;
    let keywordCount = allArticles.length;

    let generatedCount = 0;

    for (let i = 0; i < keywordsToGenerate.length; i++) {
        const keyword = keywordsToGenerate[i].trim();
        keywordCount++;
        console.log(`\n[${i + 1}/${keywordsToGenerate.length}] Memproses kata kunci: "${keyword}"`);

        try {
            console.log(" -> Langkah 1: Merancang strategi konten yang unik...");
            const analysisPrompt = getAnalysisPrompt(keyword);
            const analysisResult = await apiKeyManager.generate(analysisPrompt);
            await delay(API_CALL_DELAY_MS);
            const analysis = extractJson(analysisResult.response.text());
            if (!analysis) throw new Error("Gagal mengekstrak JSON dari hasil analisis.");
            console.log(`   -> [SUCCESS] Sudut Pandang Unik: "${analysis.uniqueAngle}"`);
            
            console.log(" -> Langkah 2: Menulis draf pertama sesuai arahan...");
            const daySlot = Math.floor((keywordCount - 1) / postsPerDay);
            const dayOffset = daySlot - (BACKDATE_DAYS > 0 ? BACKDATE_DAYS - 1 : 0);
            const publishDate = new Date();
            publishDate.setDate(publishDate.getDate() + dayOffset);
            const formattedDate = publishDate.toISOString().split('T')[0];

            const contentPrompt = getContentPrompt(keyword, analysis, formattedDate);
            const contentResult = await apiKeyManager.generate(contentPrompt);
            await delay(API_CALL_DELAY_MS);
            const jsonResult = extractJson(contentResult.response.text());
            if (!jsonResult) throw new Error("Gagal mengekstrak JSON dari hasil konten.");
            console.log(`   -> [SUCCESS] Draf pertama untuk "${keyword}" berhasil dibuat.`);

            console.log(" -> Langkah 3: Menerapkan Uniqueness Booster...");
            jsonResult.deepDive = await uniquenessBooster(jsonResult.deepDive, analysis.persona, apiKeyManager);
            jsonResult.importance = await uniquenessBooster(jsonResult.importance, analysis.persona, apiKeyManager);

            console.log(" -> Langkah 4: Mencari gambar...");
            const imageUrl = await fetchImageFromPexels(keyword, pexelsApiKey);
            jsonResult.imageUrl = imageUrl;

            allArticles.push(jsonResult);
            generatedCount++;
            console.log(` -> [SUCCESS] Artikel unik untuk "${keyword}" telah selesai.`);

            // Save progress after each article
            await fs.writeFile(OUTPUT_PATH, JSON.stringify(allArticles, null, 2));

        } catch (e) {
            console.error(` -> [FAILED] Melewati kata kunci "${keyword}" setelah mencoba semua API. Error: ${e.message}`);
        }

        if (i < keywordsToGenerate.length - 1) {
            console.log(`   ... Jeda ${REQUEST_DELAY_MS / 1000} detik sebelum kata kunci berikutnya ...`);
            await delay(REQUEST_DELAY_MS);
        }
    }
    
    return generatedCount;
}

// MAIN FUNCTION
async function main() {
  console.log("🚀 Starting Smart Content Generation...");
  
  try {
    // Ensure output directory exists
    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
    
    // Run incremental generation
    const result = await incrementalGenerate();
    
    console.log(`\n✅ Process completed!`);
    console.log(`📊 Results: ${result.generated} new articles generated, ${result.skipped} existing articles skipped`);
    
    if (result.reason === 'no_keywords') {
      console.log('💡 To generate content, add keywords to keyword.txt file');
    }

  } catch (error) {
    console.error("\n❌ Terjadi error fatal selama proses:", error);
    process.exit(1);
  }
}

// Export untuk digunakan di build-manager.js
export { incrementalGenerate };

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
