import { execSync } from 'child_process';
import niches from '../niche.config.js';

console.log('Starting the master build process for all configured niches...');

for (const niche of niches) {
  console.log(`\n================================================================`);
  console.log(`Building niche: ${niche.siteName} (ID: ${niche.id})`);
  console.log(`================================================================`);
  
  try {
    console.log(`Step 1: Generating content...`);
    execSync(`cross-env NICHE_ID=${niche.id} npm run generate`, { stdio: 'inherit' });

    console.log(`Step 2: Building site with Vite...`);
    execSync(`cross-env NICHE_ID=${niche.id} npm run build:single`, { stdio: 'inherit' });

    console.log(`Step 3: Generating sitemap...`);
    execSync(`cross-env NICHE_ID=${niche.id} npm run sitemap`, { stdio: 'inherit' });

    console.log(`\n--- ✔ Successfully built niche: ${niche.siteName} ---`);
    console.log(`--- ✔ Output located in: ./${niche.outputDir}`);

  } catch (error) {
    console.error(`\n--- ✖ FAILED to build niche: ${niche.siteName} ---`);
    process.exit(1);
  }
}

console.log('\n================================================================');
console.log('All niches have been built successfully!');
console.log('================================================================');