import { execSync } from 'child_process';
import niches from '../niche.config.js';

const args = process.argv.slice(2);
let nicheId = niches[0]?.id; // Default ke niche pertama

const nicheArg = args.find(arg => arg.startsWith('--niche='));
if (nicheArg) {
  nicheId = nicheArg.split('=')[1];
}

if (!nicheId || !niches.some(n => n.id === nicheId)) {
  console.error(`Error: Niche ID "${nicheId}" not found in niche.config.js.`);
  console.log(`Available niches are: ${niches.map(n => n.id).join(', ')}`);
  process.exit(1);
}

console.log(`Starting dev server for niche: ${nicheId}`);

try {
  const command = `cross-env NICHE_ID=${nicheId} vite`;
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error(`Failed to start dev server for niche: ${nicheId}`);
  process.exit(1);
}