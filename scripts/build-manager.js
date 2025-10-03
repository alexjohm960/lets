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
  
  getChangedFiles() {
    try {
      const result = execSync('git diff --name-only HEAD~1 HEAD 2>/dev/null || echo ""', { 
        encoding: 'utf8' 
      });
      return result.split('\n').filter(f => f);
    } catch (error) {
      console.log('⚠️  Cannot get git diff, proceeding with full build');
      return null;
    }
  }
  
  shouldRegenerateContent(changedFiles = []) {
    if (!changedFiles || changedFiles.length === 0) {
      return true;
    }
    
    const needsRegenerate = changedFiles.some(file => 
      this.triggerFiles.some(trigger => file.includes(trigger))
    );
    
    const canSkip = changedFiles.every(file =>
      this.nonTriggerFiles.some(nonTrigger => file.includes(nonTrigger))
    );
    
    return needsRegenerate || !canSkip;
  }
  
  async build() {
    console.log('🧠 Smart Build System Starting...');
    
    const changedFiles = this.getChangedFiles();
    
    if (changedFiles && changedFiles.length > 0) {
      console.log('📁 Changed files:', changedFiles);
    }
    
    if (this.shouldRegenerateContent(changedFiles)) {
      console.log('🔄 Changes detected in content-related files, regenerating...');
      try {
        execSync('node ./scripts/generate-content.js', { stdio: 'inherit' });
        console.log('✅ Content generation completed');
      } catch (error) {
        console.error('❌ Content generation failed, but continuing with build...');
      }
    } else {
      console.log('🚫 No content changes, skipping content generation');
    }
    
    console.log('🏗️  Building site with Vite...');
    execSync('vite build', { stdio: 'inherit' });
    
    console.log('📋 Running post-build tasks...');
    try {
      execSync('node ./scripts/prerender.js', { stdio: 'inherit' });
      console.log('✅ Prerender completed');
    } catch (error) {
      console.log('⚠️  Prerender failed, but continuing...');
    }
    
    try {
      execSync('node ./scripts/generate-sitemap.js', { stdio: 'inherit' });
      console.log('✅ Sitemap generated');
    } catch (error) {
      console.log('⚠️  Sitemap generation failed, but continuing...');
    }
    
    try {
      execSync('node ./scripts/generate-rss.js', { stdio: 'inherit' });
      console.log('✅ RSS generated');
    } catch (error) {
      console.log('⚠️  RSS generation failed, but continuing...');
    }
    
    console.log('✅ Build completed successfully!');
  }
}

const manager = new BuildManager();
manager.build().catch(console.error);
