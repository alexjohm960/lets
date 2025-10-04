import { BatchGenerator } from './batch-generator.js';

const generator = new BatchGenerator();
const status = generator.getStatus();

console.log('📊 Batch Generation Status');
console.log('==============================');
console.log(`📅 Started: ${new Date(status.startedAt).toLocaleString()}`);
console.log(`✅ Processed: ${status.processed}/${status.total} keywords`);
console.log(`⏳ Pending: ${status.pending} keywords`);
console.log(`📦 Batch: ${status.currentBatch}/${status.totalBatches}`);
console.log(`📈 Progress: ${((status.processed / status.total) * 100).toFixed(1)}%`);
console.log(`⚙️ Config: ${status.config.batchSize} keywords every ${status.config.intervalMinutes} minutes`);

if (status.pending > 0) {
  if (status.nextRun) {
    console.log(`⏰ Next batch: ${status.nextRun.toLocaleString()}`);
  }
  
  const estimatedMinutes = (status.pending / status.config.batchSize) * status.config.intervalMinutes;
  const estimatedCompletion = new Date(Date.now() + estimatedMinutes * 60 * 1000);
  console.log(`⏱️ Estimated completion: ${estimatedCompletion.toLocaleString()}`);
} else {
  console.log('🎉 All batches completed!');
}

console.log(`📋 Status: ${status.status}`);
