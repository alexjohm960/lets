import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ES Modules equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic imports untuk modules lain
let SmartContentGenerator;
let prerender;
let generateSitemap;
let generateRSS;

class BuildManager {
    constructor() {
        this.keywordsFile = path.join(process.cwd(), 'keyword.txt');
        this.articlesFile = path.join(process.cwd(), 'public', 'articles.json');
        this.cacheFile = path.join(process.cwd(), 'content-cache.json');
    }

    async run() {
        console.log('🧠 Smart Build System with Batch Processing');
        console.log('==========================================');
        
        try {
            // Step 1: Load keywords
            const keywords = this.loadKeywords();
            if (keywords.length === 0) {
                console.log('❌ No keywords found in keyword.txt');
                process.exit(1);
            }

            console.log(`📋 Loaded ${keywords.length} keywords from keyword.txt`);

            // Step 2: Content Generation
            console.log('🔍 Checking content needs...');
            const needsGeneration = await this.checkContentNeeds(keywords);
            
            if (needsGeneration) {
                console.log('🔄 Starting content generation...');
                await this.generateContent(keywords);
            } else {
                console.log('✅ Content is up to date, skipping generation');
            }

            // Step 3: Build Site
            console.log('🏗️  Building site with Vite...');
            await this.buildSite();

            // Step 4: Post-build tasks
            console.log('📋 Running post-build tasks...');
            await this.runPostBuildTasks();

            console.log('==========================================');
            console.log('✅ Build completed successfully!');
            console.log('💡 To add content: Add keywords to keyword.txt and rebuild');

        } catch (error) {
            console.error('❌ Build failed:', error);
            process.exit(1);
        }
    }

    loadKeywords() {
        try {
            if (!fs.existsSync(this.keywordsFile)) {
                console.log('⚠️  keyword.txt not found, creating default...');
                fs.writeFileSync(this.keywordsFile, 'Are cats or dogs smarter\nAre cats cleaner than dogs');
                return ['Are cats or dogs smarter', 'Are cats cleaner than dogs'];
            }

            const content = fs.readFileSync(this.keywordsFile, 'utf8');
            return content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0 && !line.startsWith('#'))
                .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

        } catch (error) {
            console.log('❌ Error loading keywords:', error.message);
            return [];
        }
    }

    async checkContentNeeds(keywords) {
        try {
            // Check if articles.json exists and has content
            if (!fs.existsSync(this.articlesFile)) {
                console.log('📝 articles.json not found, need generation');
                return true;
            }

            const articlesData = JSON.parse(fs.readFileSync(this.articlesFile, 'utf8'));
            const existingArticles = articlesData.articles || [];
            
            // Check cache for better tracking
            const cache = fs.existsSync(this.cacheFile) 
                ? JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'))
                : { generatedKeywords: [] };

            const existingKeywords = existingArticles.map(article => article.keyword?.toLowerCase().trim());
            const cachedKeywords = cache.generatedKeywords || [];
            const allExisting = [...new Set([...existingKeywords, ...cachedKeywords])];

            const newKeywords = keywords.filter(keyword => 
                !allExisting.includes(keyword.toLowerCase().trim())
            );

            if (newKeywords.length > 0) {
                console.log(`🆕 Found ${newKeywords.length} new keywords that need generation`);
                return true;
            }

            console.log(`✅ All ${keywords.length} keywords already have content`);
            return false;

        } catch (error) {
            console.log('❌ Error checking content needs:', error.message);
            return true; // Default to generation if there's any error
        }
    }

    async generateContent(keywords) {
        try {
            // Dynamic import untuk avoid circular dependencies
            if (!SmartContentGenerator) {
                const module = await import('./generate-content.js');
                SmartContentGenerator = module.SmartContentGenerator;
            }
            
            const generator = new SmartContentGenerator();
            const result = await generator.generateForKeywords(keywords);
            
            console.log(`📊 Generation results: ${result.generated} new, ${result.skipped} existing, ${result.failed} failed`);
            
            if (result.failed > 0) {
                console.log('⚠️  Some keywords failed, but continuing build...');
            }
            
            return result;

        } catch (error) {
            console.log('❌ Content generation failed:', error);
            throw error;
        }
    }

    async buildSite() {
        try {
            execSync('npm run build:vite', { 
                stdio: 'inherit',
                cwd: process.cwd()
            });
            console.log('✅ Site build completed');
        } catch (error) {
            console.log('❌ Site build failed:', error.message);
            throw error;
        }
    }

    async runPostBuildTasks() {
        try {
            // Run prerender
            console.log('🔍 Prerendering pages...');
            await this.runPrerender();

            // Generate sitemap
            console.log('🗺️  Generating sitemap...');
            await this.generateSitemap();

            // Generate RSS
            console.log('📢 Generating RSS feed...');
            await this.generateRSS();

        } catch (error) {
            console.log('⚠️  Some post-build tasks failed, but continuing...', error.message);
        }
    }

    async runPrerender() {
        try {
            if (!prerender) {
                const module = await import('./prerender.js');
                prerender = module.prerender;
            }
            await prerender();
        } catch (error) {
            console.log('❌ Prerender failed:', error.message);
        }
    }

    async generateSitemap() {
        try {
            if (!generateSitemap) {
                const module = await import('./sitemap-generator.js');
                generateSitemap = module.generateSitemap;
            }
            await generateSitemap();
        } catch (error) {
            console.log('❌ Sitemap generation failed:', error.message);
        }
    }

    async generateRSS() {
        try {
            if (!generateRSS) {
                const module = await import('./rss-generator.js');
                generateRSS = module.generateRSS;
            }
            await generateRSS();
        } catch (error) {
            console.log('❌ RSS generation failed:', error.message);
        }
    }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const manager = new BuildManager();
    manager.run().catch(console.error);
}

export { BuildManager };
