import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

const DIST_PATH = path.resolve(process.cwd(), 'dist');
const ARTICLES_PATH = path.resolve(process.cwd(), 'public/articles.json');
// Kita asumsikan server berjalan di port 4173, Vite akan otomatis mencari port lain jika perlu
const BASE_URL = 'http://localhost:4173'; 

async function main() {
  console.log('--- Starting Prerender Process ---');
  let browser;

  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    const articles = JSON.parse(await fs.readFile(ARTICLES_PATH, 'utf-8'));
    const articleRoutes = articles.map(article => `/${article.slug}`);
    const staticRoutes = ['/', '/categories', '/about', '/contact', '/privacy-policy', '/terms-of-service'];
    const allRoutes = [...staticRoutes, ...articleRoutes];

    console.log(`Found ${allRoutes.length} routes to prerender from ${BASE_URL}.`);

    for (const route of allRoutes) {
      const fullUrl = `${BASE_URL}${route}`;
      console.log(`Prerendering: ${fullUrl}`);

      try {
        await page.goto(fullUrl, { waitUntil: 'networkidle0' });
        const content = await page.content();

        const filePath = route === '/' 
          ? path.join(DIST_PATH, 'index.html') 
          : path.join(DIST_PATH, route, 'index.html');
        
        const dirPath = path.dirname(filePath);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(filePath, content, 'utf-8');

        console.log(` -> Saved to: ${filePath}`);
      } catch (error) {
        console.error(` -> Failed to prerender ${route}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('An unrecoverable error occurred during prerender:', error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    console.log('--- Prerender Process Finished ---');
  }
}

main();
