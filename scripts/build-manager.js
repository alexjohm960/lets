import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class BuildManager {
  constructor() {
    this.triggerFiles = ['keyword.txt', 'scripts/generate-content.js', 'apikey.txt', 'pexels_apikey.txt'];
    this.nonTriggerFiles = ['src/components/', 'src/assets/', 'public/', 'src/styles/', 'package.json', 'vite.config.js'];
  }
  
  hasKeywords() {
    try {
      const keywordPath = join(process.cwd(), 'keyword.txt');
      if (!existsSync(keywordPath)) return false;
      
      const content = readFileSync(keywordPath, 'utf-8');
      const keywords = content.split('\n').filter(k => k.trim());
      return keywords.length > 0;
    } catch (error) {
      return false;
    }
  }
  
  hasArticles() {
    try {
      const articlesPath = join(process.cwd(), 'public/articles.json');
      if (!existsSync(articlesPath)) {
        return false;
      }
      
      const content = readFileSync(articlesPath, 'utf-8');
      const articles = JSON.parse(content);
      return articles.length > 0;
    } catch (error) {
      return false;
    }
  }
  
  getChangedFiles() {
    try {
      const result = execSync('git diff --name-only HEAD~1 HEAD 2>/dev/null || echo ""', { 
        encoding: 'utf8' 
      });
      const files = result.split('\n').filter(f => f);
      return files.length > 0 ? files : null;
    } catch (error) {
      console.log('⚠️  Cannot get git diff, proceeding with build');
      return null;
    }
  }
  
  shouldRegenerateContent(changedFiles = []) {
    if (!changedFiles || changedFiles.length === 0) {
      console.log('🔍 No changed files detected, checking for content needs...');
      return this.hasKeywords(); // Regenerate if we have keywords
    }
    
    console.log('📁 Changed files detected:', changedFiles);
    
    const needsRegenerate = changedFiles.some(file => 
      this.triggerFiles.some(trigger => file.includes(trigger))
    );
    
    const canSkip = changedFiles.every(file =>
      this.nonTriggerFiles.some(nonTrigger => file.includes(nonTrigger))
    );
    
    return needsRegenerate || !canSkip;
  }
  
  async build() {
    console.log('🧠 Smart Build System with Batch Processing');
    console.log('==========================================');
    
    // Check if batch processing is enabled (progress file exists)
    const shouldUseBatch = this.hasKeywords() && existsSync(join(process.cwd(), '.batch-progress.json'));
    
    if (shouldUseBatch) {
      console.log('🔄 Batch processing mode detected');
      return await this.runBatchBuild();
    } else {
      console.log('🚀 Standard build mode');
      return await this.runStandardBuild();
    }
  }
  
  async runBatchBuild() {
    try {
      // Import and run batch generator
      const { BatchGenerator } = await import('./batch-generator.js');
      const generator = new BatchGenerator();
      
      const result = await generator.runBatch();
      
      if (result.processed > 0 && result.shouldDeploy) {
        console.log('------------------------------------------');
        console.log('🏗️  Building site with new content...');
        
        // Build the site
        execSync('vite build', { stdio: 'inherit' });
        console.log('✅ Site build completed');
        
        // Run post-build tasks if we have articles
        if (this.hasArticles()) {
          console.log('📋 Running post-build tasks...');
          
          try {
            execSync('node ./scripts/prerender.js', { stdio: 'inherit' });
            console.log('✅ Prerender completed');
          } catch (error) {
            console.log('⚠️  Prerender failed:', error.message);
          }
          
          try {
            execSync('node ./scripts/generate-sitemap.js', { stdio: 'inherit' });
            console.log('✅ Sitemap generated');
          } catch (error) {
            console.log('⚠️  Sitemap generation failed:', error.message);
          }
          
          try {
            execSync('node ./scripts/generate-rss.js', { stdio: 'inherit' });
            console.log('✅ RSS generated');
          } catch (error) {
            console.log('⚠️  RSS generation failed:', error.message);
          }
        }
        
        console.log('==========================================');
        console.log(`✅ Build completed! Processed ${result.processed} new articles`);
        
        const status = generator.getStatus();
        if (status.pending > 0) {
          console.log(`⏰ Next batch will run at: ${status.nextRun.toLocaleString()}`);
          console.log(`📊 Remaining: ${status.pending} keywords (${status.totalBatches - status.currentBatch} batches)`);
        } else {
          console.log('🎉 All content generation completed!');
        }
        
      } else {
        console.log('⏭️  No new batch processed, skipping build');
        console.log(`💡 Reason: ${result.reason}`);
      }
      
    } catch (error) {
      console.error('❌ Batch build failed:', error.message);
      // Fallback to standard build
      console.log('🔄 Falling back to standard build...');
      await this.runStandardBuild();
    }
  }
  
  async runStandardBuild() {
    // Check if we have keywords
    const hasKeywords = this.hasKeywords();
    const hasArticles = this.hasArticles();
    
    if (!hasKeywords) {
      console.log('💡 Tip: Add keywords to keyword.txt to generate content');
    }
    
    // Get changed files
    const changedFiles = this.getChangedFiles();
    
    // Decide if we should generate content
    const shouldGenerate = hasKeywords && this.shouldRegenerateContent(changedFiles);
    
    if (shouldGenerate) {
      console.log('🔄 Starting content generation...');
      try {
        execSync('node ./scripts/generate-content.js', { stdio: 'inherit' });
        console.log('✅ Content generation completed');
      } catch (error) {
        console.error('❌ Content generation failed, but continuing with build...');
      }
    } else if (hasKeywords) {
      console.log('🚫 No changes detected, skipping content generation');
    } else {
      console.log('⏭️  No keywords found, skipping content generation');
    }
    
    console.log('------------------------------------------');
    
    // Always build the site
    console.log('🏗️  Building site with Vite...');
    try {
      execSync('vite build', { stdio: 'inherit' });
      console.log('✅ Site build completed');
    } catch (error) {
      console.error('❌ Site build failed:', error.message);
      process.exit(1);
    }
    
    console.log('------------------------------------------');
    
    // Post-build tasks - only run if we have articles
    console.log('📋 Running post-build tasks...');
    
    if (this.hasArticles()) {
      console.log('📚 Articles found, running post-processing...');
      
      try {
        console.log('🔍 Prerendering pages...');
        execSync('node ./scripts/prerender.js', { stdio: 'inherit' });
        console.log('✅ Prerender completed');
      } catch (error) {
        console.log('⚠️  Prerender failed:', error.message);
      }
      
      try {
        console.log('🗺️  Generating sitemap...');
        execSync('node ./scripts/generate-sitemap.js', { stdio: 'inherit' });
        console.log('✅ Sitemap generated');
      } catch (error) {
        console.log('⚠️  Sitemap generation failed:', error.message);
      }
      
      try {
        console.log('📢 Generating RSS feed...');
        execSync('node ./scripts/generate-rss.js', { stdio: 'inherit' });
        console.log('✅ RSS generated');
      } catch (error) {
        console.log('⚠️  RSS generation failed:', error.message);
      }
    } else {
      console.log('📭 No articles found, skipping post-processing');
      console.log('💡 Generated site will work with static pages only');
    }
    
    console.log('==========================================');
    console.log('✅ Build completed successfully!');
    
    if (!hasArticles) {
      console.log('💡 To add content: Add keywords to keyword.txt and rebuild');
    }
  }
}

const manager = new BuildManager();
manager.build().catch(console.error);
