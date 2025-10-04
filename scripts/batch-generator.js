import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

// ⚙️ CONFIGURATION - Sesuai rekomendasi
const BATCH_SIZE = 5;                    // 5 artikel per batch
const BATCH_INTERVAL_MINUTES = 30;       // 30 menit antara batch
const PROGRESS_FILE = join(process.cwd(), '.batch-progress.json');
const BATCH_KEYWORD_FILE = join(process.cwd(), 'keyword-batch.txt');

class BatchGenerator {
  constructor() {
    this.progress = this.loadProgress();
  }

  loadProgress() {
    try {
      if (existsSync(PROGRESS_FILE)) {
        const progress = JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'));
        console.log('📁 Loaded existing progress file');
        return progress;
      }
    } catch (error) {
      console.log('❌ Error loading progress file, creating new...');
    }
    
    // Initialize fresh progress
    return {
      totalKeywords: 0,
      processedKeywords: [],
      currentBatch: 0,
      totalBatches: 0,
      lastRun: null,
      status: 'idle',
      startedAt: new Date().toISOString()
    };
  }

  saveProgress() {
    writeFileSync(PROGRESS_FILE, JSON.stringify(this.progress, null, 2));
    console.log('💾 Progress saved');
  }

  getPendingKeywords() {
    try {
      const allKeywords = readFileSync('keyword.txt', 'utf-8')
        .split('\n')
        .filter(k => k.trim())
        .map(k => k.trim());

      const processed = new Set(this.progress.processedKeywords);
      const pending = allKeywords.filter(keyword => !processed.has(keyword));
      
      return pending;
    } catch (error) {
      console.error('❌ Error reading keyword.txt:', error.message);
      return [];
    }
  }

  shouldRunBatch() {
    // Check if all batches are completed
    if (this.progress.status === 'completed') {
      console.log('✅ All batches completed!');
      return false;
    }

    // Check time interval
    if (this.progress.lastRun) {
      const lastRunTime = new Date(this.progress.lastRun);
      const now = new Date();
      const minutesSinceLastRun = (now - lastRunTime) / (1000 * 60);
      
      if (minutesSinceLastRun < BATCH_INTERVAL_MINUTES) {
        const minutesLeft = Math.ceil(BATCH_INTERVAL_MINUTES - minutesSinceLastRun);
        console.log(`⏳ Next batch in ${minutesLeft} minutes...`);
        return false;
      }
    }

    return true;
  }

  prepareBatch() {
    const pendingKeywords = this.getPendingKeywords();
    
    if (pendingKeywords.length === 0) {
      this.progress.status = 'completed';
      this.saveProgress();
      console.log('🎉 All keywords processed!');
      return null;
    }

    const batchKeywords = pendingKeywords.slice(0, BATCH_SIZE);
    
    // Create batch keyword file
    writeFileSync(BATCH_KEYWORD_FILE, batchKeywords.join('\n'));
    
    // Update progress
    this.progress.currentBatch++;
    this.progress.totalKeywords = this.progress.processedKeywords.length + pendingKeywords.length;
    this.progress.totalBatches = Math.ceil(pendingKeywords.length / BATCH_SIZE);
    this.progress.status = 'processing';
    
    console.log(`📦 Batch ${this.progress.currentBatch}/${this.progress.totalBatches}`);
    console.log(`📝 Processing ${batchKeywords.length} keywords:`);
    batchKeywords.forEach((keyword, index) => {
      console.log(`   ${index + 1}. ${keyword}`);
    });

    return batchKeywords;
  }

  markBatchComplete(processedKeywords) {
    this.progress.processedKeywords.push(...processedKeywords);
    this.progress.lastRun = new Date().toISOString();
    this.saveProgress();

    const pending = this.progress.totalKeywords - this.progress.processedKeywords.length;
    
    console.log(`✅ Batch ${this.progress.currentBatch} completed!`);
    console.log(`📊 Progress: ${this.progress.processedKeywords.length}/${this.progress.totalKeywords} keywords (${((this.progress.processedKeywords.length / this.progress.totalKeywords) * 100).toFixed(1)}%)`);
    
    if (pending > 0) {
      const nextBatchTime = new Date(Date.now() + BATCH_INTERVAL_MINUTES * 60 * 1000);
      console.log(`⏰ Next batch: ${nextBatchTime.toLocaleTimeString()}`);
    } else {
      console.log('🎉 All batches completed!');
      this.progress.status = 'completed';
      this.saveProgress();
    }
  }

  cleanupBatchFile() {
    try {
      if (existsSync(BATCH_KEYWORD_FILE)) {
        execSync(`rm ${BATCH_KEYWORD_FILE}`);
        console.log('🧹 Cleaned up batch keyword file');
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  async runBatch() {
    console.log('🔄 Batch Content Generator');
    console.log('==============================');
    
    // Check if we should run this batch
    if (!this.shouldRunBatch()) {
      this.cleanupBatchFile();
      return { 
        processed: 0, 
        shouldDeploy: false,
        reason: 'interval_not_reached'
      };
    }

    const batchKeywords = this.prepareBatch();
    if (!batchKeywords) {
      this.cleanupBatchFile();
      return { 
        processed: 0, 
        shouldDeploy: true,
        reason: 'all_completed' 
      };
    }

    console.log('🚀 Starting batch generation...');
    
    try {
      // Use the batch keyword file for generation
      execSync('node ./scripts/generate-content.js', { stdio: 'inherit' });
      
      this.markBatchComplete(batchKeywords);
      this.cleanupBatchFile();
      
      return { 
        processed: batchKeywords.length, 
        shouldDeploy: true,
        hasMore: this.getPendingKeywords().length > 0,
        reason: 'batch_completed'
      };
      
    } catch (error) {
      console.error('❌ Batch generation failed:', error.message);
      this.cleanupBatchFile();
      return { 
        processed: 0, 
        shouldDeploy: false,
        reason: 'generation_failed'
      };
    }
  }

  getStatus() {
    const pending = this.getPendingKeywords();
    const processed = this.progress.processedKeywords.length;
    const total = processed + pending.length;
    
    let nextRun = null;
    if (this.progress.lastRun && pending.length > 0) {
      nextRun = new Date(new Date(this.progress.lastRun).getTime() + BATCH_INTERVAL_MINUTES * 60 * 1000);
    }
    
    return {
      processed,
      pending: pending.length,
      total,
      currentBatch: this.progress.currentBatch,
      totalBatches: this.progress.totalBatches,
      status: this.progress.status,
      nextRun: nextRun,
      startedAt: this.progress.startedAt,
      config: {
        batchSize: BATCH_SIZE,
        intervalMinutes: BATCH_INTERVAL_MINUTES
      }
    };
  }

  // Utility function to reset progress
  resetProgress() {
    this.progress = {
      totalKeywords: 0,
      processedKeywords: [],
      currentBatch: 0,
      totalBatches: 0,
      lastRun: null,
      status: 'idle',
      startedAt: new Date().toISOString()
    };
    this.saveProgress();
    this.cleanupBatchFile();
    console.log('🔄 Progress reset successfully');
  }
}

// Main execution
async function main() {
  const generator = new BatchGenerator();
  
  // Show current status
  const status = generator.getStatus();
  console.log('📊 Current Status:');
  console.log(`   ✅ Processed: ${status.processed}/${status.total} keywords`);
  console.log(`   ⏳ Pending: ${status.pending} keywords`);
  console.log(`   📦 Batch: ${status.currentBatch}/${status.totalBatches}`);
  console.log(`   📈 Progress: ${((status.processed / status.total) * 100).toFixed(1)}%`);
  console.log(`   ⚙️ Config: ${status.config.batchSize} keywords every ${status.config.intervalMinutes} minutes`);
  
  if (status.pending > 0 && status.nextRun) {
    console.log(`   ⏰ Next batch: ${status.nextRun.toLocaleString()}`);
  }
  
  console.log('==============================');
  
  const result = await generator.runBatch();
  
  if (result.processed > 0) {
    console.log('✅ Batch processing completed successfully');
  }
  
  return result;
}

// Export for use in build manager
export { BatchGenerator, BATCH_SIZE, BATCH_INTERVAL_MINUTES };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
