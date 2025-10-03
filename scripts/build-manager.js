
// scripts/build-manager.js
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class BuildManager {
  constructor() {
    this.triggerFiles = ['keyword.txt', 'src/templates/', 'scripts/generate-content.js'];
    this.nonTriggerFiles = ['src/components/', 'src/assets/', 'public/', 'src/styles/'];
  }
  
  getChangedFiles() {
    try {
      const result = execSync('git diff --name-only HEAD~1 HEAD 2>/dev/null || echo ""', { 
        encoding: 'utf8' 
      });
      return result.split('\n').filter(f => f);
    } catch (error) {
      console.log('⚠️  Cannot get git diff, assuming all files changed');
      return null;
    }
  }
  
  shouldRegenerateContent(changedFiles = []) {
    if (!changedFiles || changedFiles.length === 0) {
      return true; // Safe default
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
    
    if (this.shouldRegenerateContent(changedFiles)) {
      console.log('🔄 Changes detected in content-related files, regenerating...');
      execSync('node ./scripts/generate-content.js', { stdio: 'inherit' });
    } else {
      console.log('🚫 No content changes, skipping regeneration');
      console.log('📁 Changed files:', changedFiles);
    }
    
    // Always build the site
    console.log('🏗️  Building site with Vite...');
    execSync('vite build', { stdio: 'inherit' });
    
    // Run post-build scripts
    console.log('📋 Running post-build tasks...');
    try {
      execSync('node ./scripts/prerender.js', { stdio: 'inherit' });
      execSync('node ./scripts/generate-sitemap.js', { stdio: 'inherit' }); 
      execSync('node ./scripts/generate-rss.js', { stdio: 'inherit' });
    } catch (error) {
      console.log('⚠️  Some post-build scripts failed, but continuing...');
    }
    
    console.log('✅ Build completed successfully!');
  }
}

const manager = new BuildManager();
manager.build().catch(console.error);
