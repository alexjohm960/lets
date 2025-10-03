import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

const DIST_PATH = path.resolve(process.cwd(), 'dist');
const ARTICLES_PATH = path.resolve(process.cwd(), 'public/articles.json');
const BASE_URL = 'http://localhost:4173';

async function main() {
  console.log('--- Starting Prerender Process ---');
  let browser;

  try {
    // Check if articles.json exists
    try {
      await fs.access(ARTICLES_PATH);
      console.log('📚 articles.json found');
    } catch (error) {
      console.log('⏭️  articles.json not found, skipping prerender');
      console.log('💡 Tip: Add keywords to keyword.txt and rebuild to generate articles');
      return;
    }

    // Read and parse articles
    const articlesData = await fs.readFile(ARTICLES_PATH, 'utf-8');
    const articles = JSON.parse(articlesData);
    
    if (articles.length === 0) {
      console.log('📭 No articles found in articles.json, skipping prerender');
      console.log('💡 Tip: Add keywords to keyword.txt and rebuild to generate articles');
      return;
    }

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({ width: 1280, height: 720 });

    const articleRoutes = articles.map(article => `/${article.slug}`);
    const staticRoutes = ['/', '/categories', '/about', '/contact', '/privacy-policy', '/terms-of-service'];
    const allRoutes = [...staticRoutes, ...articleRoutes];

    console.log(`🔍 Found ${articles.length} articles`);
    console.log(`📄 Total routes to prerender: ${allRoutes.length}`);
    console.log(`🌐 Starting from base URL: ${BASE_URL}`);

    let successCount = 0;
    let errorCount = 0;

    for (const route of allRoutes) {
      const fullUrl = `${BASE_URL}${route}`;
      
      try {
        console.log(`🔄 Prerendering: ${fullUrl}`);

        // Navigate to the page
        await page.goto(fullUrl, { 
          waitUntil: ['networkidle0', 'domcontentloaded'],
          timeout: 30000
        });

        // Wait a bit more for any dynamic content
        await page.waitForTimeout(1000);

        // Get the rendered HTML
        const content = await page.content();

        // Determine file path
        const filePath = route === '/' 
          ? path.join(DIST_PATH, 'index.html') 
          : path.join(DIST_PATH, route, 'index.html');
        
        // Create directory if it doesn't exist
        const dirPath = path.dirname(filePath);
        await fs.mkdir(dirPath, { recursive: true });
        
        // Write the prerendered HTML
        await fs.writeFile(filePath, content, 'utf-8');

        console.log(`   ✅ Saved to: ${filePath}`);
        successCount++;

      } catch (error) {
        console.error(`   ❌ Failed to prerender ${route}: ${error.message}`);
        errorCount++;
        
        // Continue with next route instead of stopping
        continue;
      }
    }

    console.log('--- Prerender Process Finished ---');
    console.log(`📊 Results: ${successCount} successful, ${errorCount} failed`);

    if (errorCount > 0) {
      console.log('⚠️  Some routes failed to prerender, but build continues...');
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('⏭️  articles.json not found, skipping prerender');
      console.log('💡 This is normal when no keywords are provided');
      return;
    }
    
    console.error('❌ An unrecoverable error occurred during prerender:', error.message);
    // Don't exit process - let build continue
    console.log('⚠️  Prerender failed, but build continues...');
  } finally {
    if (browser) {
      await browser.close();
      console.log('🔒 Browser closed');
    }
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception in prerender:', error.message);
  // Don't exit - let the build continue
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection in prerender at:', promise, 'reason:', reason);
  // Don't exit - let the build continue
});

main().catch(error => {
  console.error('❌ Prerender process failed:', error.message);
  console.log('⚠️  Continuing build without prerender...');
  // Exit with 0 to not break the build process
  process.exit(0);
});
