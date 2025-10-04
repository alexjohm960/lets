import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic imports
let ApiKeyManager;
let ContentGenerator;
let ImageSearch;

class SmartContentGenerator {
    constructor() {
        this.apiKeyManager = null;
        this.contentGenerator = null;
        this.imageSearch = null;
        this.articlesFile = path.join(process.cwd(), 'public', 'articles.json');
        this.cacheFile = path.join(process.cwd(), 'content-cache.json');
        this.ensureDirectories();
    }

    async initialize() {
        if (!ApiKeyManager) {
            const module = await import('./api-key-manager.js');
            ApiKeyManager = module.ApiKeyManager;
        }
        if (!ContentGenerator) {
            const module = await import('./content-generator.js');
            ContentGenerator = module.ContentGenerator;
        }
        if (!ImageSearch) {
            const module = await import('./image-search.js');
            ImageSearch = module.ImageSearch;
        }

        this.apiKeyManager = new ApiKeyManager();
        this.contentGenerator = new ContentGenerator(this.apiKeyManager);
        this.imageSearch = new ImageSearch();
    }

    ensureDirectories() {
        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }
    }

    async loadArticles() {
        try {
            if (fs.existsSync(this.articlesFile)) {
                const data = fs.readFileSync(this.articlesFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.log('❌ Error loading articles:', error.message);
        }
        return { articles: [], lastUpdated: new Date().toISOString() };
    }

    async loadCache() {
        try {
            if (fs.existsSync(this.cacheFile)) {
                const data = fs.readFileSync(this.cacheFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.log('❌ Error loading cache:', error.message);
        }
        return { generatedKeywords: [], lastUpdated: new Date().toISOString() };
    }

    async saveCache(cache) {
        try {
            cache.lastUpdated = new Date().toISOString();
            fs.writeFileSync(this.cacheFile, JSON.stringify(cache, null, 2));
            console.log('💾 Cache saved successfully');
        } catch (error) {
            console.log('❌ Error saving cache:', error.message);
        }
    }

    async saveArticles(articlesData) {
        try {
            articlesData.lastUpdated = new Date().toISOString();
            fs.writeFileSync(this.articlesFile, JSON.stringify(articlesData, null, 2));
            console.log('💾 Articles saved successfully');
            
            // Juga save ke dist folder untuk build
            const distArticlesFile = path.join(process.cwd(), 'dist', 'articles.json');
            const distDir = path.dirname(distArticlesFile);
            if (!fs.existsSync(distDir)) {
                fs.mkdirSync(distDir, { recursive: true });
            }
            fs.writeFileSync(distArticlesFile, JSON.stringify(articlesData, null, 2));
        } catch (error) {
            console.log('❌ Error saving articles:', error.message);
        }
    }

    async generateForKeywords(keywords) {
        console.log('🚀 Starting Smart Content Generation...');
        console.log('🔍 Starting incremental content generation...');

        // Initialize dependencies
        await this.initialize();

        // Load existing data
        const articlesData = await this.loadArticles();
        const cache = await this.loadCache();
        
        const existingArticles = articlesData.articles || [];
        const existingKeywords = existingArticles.map(article => article.keyword?.toLowerCase().trim());
        const cachedKeywords = cache.generatedKeywords || [];

        // Combine both tracking methods
        const allExistingKeywords = [...new Set([...existingKeywords, ...cachedKeywords])];
        
        console.log(`📚 Loaded ${existingArticles.length} existing articles`);
        console.log(`📁 Existing keywords: ${allExistingKeywords.length}`);
        
        // Filter new keywords
        const newKeywords = keywords.filter(keyword => 
            !allExistingKeywords.includes(keyword.toLowerCase().trim())
        );
        
        console.log(`📝 New keywords to generate: ${newKeywords.length}`);

        if (newKeywords.length === 0) {
            console.log('✅ No new keywords to generate');
            return { generated: 0, skipped: keywords.length };
        }

        console.log(`\n[INFO] Memproses ${newKeywords.length} kata kunci baru...\n`);

        let generatedCount = 0;
        const failedKeywords = [];

        for (let i = 0; i < newKeywords.length; i++) {
            const keyword = newKeywords[i];
            console.log(`[${i + 1}/${newKeywords.length}] Memproses kata kunci: "${keyword}"`);
            
            try {
                const article = await this.generateArticle(keyword);
                if (article) {
                    // Add to articles
                    existingArticles.push(article);
                    
                    // Add to cache
                    if (!cache.generatedKeywords) cache.generatedKeywords = [];
                    cache.generatedKeywords.push(keyword.toLowerCase().trim());
                    
                    generatedCount++;
                    
                    // Save progress after each article
                    await this.saveArticles({ ...articlesData, articles: existingArticles });
                    await this.saveCache(cache);
                    
                    console.log(` -> [SUCCESS] Artikel unik untuk "${keyword}" telah selesai.`);
                } else {
                    failedKeywords.push(keyword);
                    console.log(` -> [FAILED] Gagal generate artikel untuk "${keyword}"`);
                }
            } catch (error) {
                failedKeywords.push(keyword);
                console.log(` -> [ERROR] Error processing "${keyword}":`, error.message);
            }

            // Jeda antara keyword (kecuali keyword terakhir)
            if (i < newKeywords.length - 1) {
                console.log('   ... Jeda 10 detik sebelum kata kunci berikutnya ...');
                await this.delay(10000);
            }
        }

        // Final save
        await this.saveArticles({ ...articlesData, articles: existingArticles });
        await this.saveCache(cache);

        console.log(`\n🎉 Generated ${generatedCount} new articles`);
        console.log(`📊 Total keywords in cache: ${cache.generatedKeywords?.length || 0}`);
        console.log(`📚 Total articles: ${existingArticles.length}`);
        
        if (failedKeywords.length > 0) {
            console.log(`❌ Failed keywords: ${failedKeywords.join(', ')}`);
        }

        return {
            generated: generatedCount,
            skipped: keywords.length - newKeywords.length,
            failed: failedKeywords.length
        };
    }

    async generateArticle(keyword) {
        try {
            // Step 1: Content Strategy
            console.log(' -> Langkah 1: Merancang strategi konten yang unik...');
            const strategy = await this.contentGenerator.createContentStrategy(keyword);
            if (!strategy) {
                throw new Error('Failed to create content strategy');
            }

            // Step 2: First Draft
            console.log(' -> Langkah 2: Menulis draf pertama sesuai arahan...');
            let draft = await this.contentGenerator.writeFirstDraft(keyword, strategy);
            if (!draft) {
                throw new Error('Failed to write first draft');
            }

            // Step 3: Uniqueness Booster
            console.log(' -> Langkah 3: Menerapkan Uniqueness Booster...');
            draft = await this.contentGenerator.applyUniquenessBooster(draft);
            if (!draft) {
                console.log(' -> [WARNING] Uniqueness booster failed, using original draft');
            }

            // Step 4: Image Search
            console.log(' -> Langkah 4: Mencari gambar...');
            const imageUrl = await this.imageSearch.searchImage(keyword);
            
            // Create article object
            const article = {
                id: this.generateId(),
                keyword: keyword,
                title: draft.title || this.generateTitle(keyword),
                content: draft.content || draft,
                excerpt: draft.excerpt || this.generateExcerpt(draft.content || draft),
                imageUrl: imageUrl,
                slug: this.generateSlug(keyword),
                published: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                strategy: strategy
            };

            return article;

        } catch (error) {
            console.log(` -> [ERROR] Error generating article for "${keyword}":`, error.message);
            return null;
        }
    }

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    generateTitle(keyword) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
    }

    generateExcerpt(content, length = 150) {
        if (typeof content === 'string') {
            return content.substring(0, length) + (content.length > length ? '...' : '');
        }
        return 'Artikel tentang ' + length + ' karakter';
    }

    generateSlug(keyword) {
        return keyword
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export { SmartContentGenerator };
