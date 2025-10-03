import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_PATH = path.resolve(process.cwd(), 'dist');
const ARTICLES_PATH = path.resolve(process.cwd(), 'public/articles.json');
const SITE_URL = process.env.VITE_SITE_URL || 'https://www.kontenkit.com';

const todayISO = new Date().toISOString().split('T')[0];

function generateUrlset(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${SITE_URL}${page.url.endsWith('/') && page.url.length > 1 ? page.url.slice(0, -1) : page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`.trim();
}

function generateSitemapIndex(sitemaps) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${SITE_URL}/${sitemap.filename}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`.trim();
}

async function checkArticlesExist() {
  try {
    await fs.access(ARTICLES_PATH);
    const fileContent = await fs.readFile(ARTICLES_PATH, 'utf-8');
    const articles = JSON.parse(fileContent);
    return articles.length > 0;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📭 articles.json not found - generating static sitemaps only');
      return false;
    }
    throw error;
  }
}

async function generateDynamicSitemaps(allSitemaps) {
  try {
    const fileContent = await fs.readFile(ARTICLES_PATH, 'utf-8');
    const articles = JSON.parse(fileContent);

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const publishedArticles = articles.filter(article => article.date && new Date(article.date) <= today);

    if (publishedArticles.length === 0) {
      console.log('📭 No published articles found - skipping dynamic sitemaps');
      return;
    }

    console.log(`📚 Processing ${publishedArticles.length} published articles for sitemaps`);

    // Generate posts sitemap
    const postPages = publishedArticles.map(article => ({
      url: `/${article.slug}`,
      lastmod: article.date,
      changefreq: 'yearly',
      priority: '0.9',
    }));
    const postsSitemapContent = generateUrlset(postPages);
    await fs.writeFile(path.join(DIST_PATH, 'sitemap-posts.xml'), postsSitemapContent);
    allSitemaps.push({ filename: 'sitemap-posts.xml', lastmod: todayISO });
    console.log(`✅ Generated sitemap-posts.xml with ${postPages.length} URLs`);

    // Generate categories sitemap
    const categoryMap = new Map();
    publishedArticles.forEach(article => {
      if (article.categorySlug) {
        const existingDate = categoryMap.get(article.categorySlug) || '1970-01-01';
        if (article.date > existingDate) {
          categoryMap.set(article.categorySlug, article.date);
        }
      }
    });
    
    const categoryPages = Array.from(categoryMap.entries()).map(([slug, lastmod]) => ({
      url: `/category/${slug}`,
      lastmod: lastmod,
      changefreq: 'weekly',
      priority: '0.8',
    }));
    
    if (categoryPages.length > 0) {
      const categoriesSitemapContent = generateUrlset(categoryPages);
      await fs.writeFile(path.join(DIST_PATH, 'sitemap-categories.xml'), categoriesSitemapContent);
      allSitemaps.push({ filename: 'sitemap-categories.xml', lastmod: todayISO });
      console.log(`✅ Generated sitemap-categories.xml with ${categoryPages.length} URLs`);
    }

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📭 articles.json not found - skipping dynamic sitemaps');
    } else {
      console.error('❌ Error generating dynamic sitemaps:', error.message);
      // Don't throw error to avoid breaking the build
    }
  }
}

async function main() {
  console.log('🗺️  Generating sitemap index and child sitemaps...');
  
  try {
    // Ensure dist directory exists
    await fs.mkdir(DIST_PATH, { recursive: true });

    const allSitemaps = [];

    // Always generate static pages sitemap
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: '1.0', lastmod: todayISO },
      { url: '/categories', changefreq: 'weekly', priority: '0.8', lastmod: todayISO },
      { url: '/about', changefreq: 'monthly', priority: '0.7', lastmod: todayISO },
      { url: '/contact', changefreq: 'monthly', priority: '0.7', lastmod: todayISO },
      { url: '/privacy-policy', changefreq: 'yearly', priority: '0.5', lastmod: todayISO },
      { url: '/terms-of-service', changefreq: 'yearly', priority: '0.5', lastmod: todayISO },
    ];
    
    const pagesSitemapContent = generateUrlset(staticPages);
    await fs.writeFile(path.join(DIST_PATH, 'sitemap-pages.xml'), pagesSitemapContent);
    allSitemaps.push({ filename: 'sitemap-pages.xml', lastmod: todayISO });
    console.log(`✅ Generated sitemap-pages.xml with ${staticPages.length} static URLs`);

    // Generate dynamic sitemaps only if articles exist
    const hasArticles = await checkArticlesExist();
    if (hasArticles) {
      await generateDynamicSitemaps(allSitemaps);
    } else {
      console.log('⏭️  No articles found - generating static sitemaps only');
    }

    // Generate sitemap index
    const sitemapIndexContent = generateSitemapIndex(allSitemaps);
    await fs.writeFile(path.join(DIST_PATH, 'sitemap.xml'), sitemapIndexContent);
    
    console.log('\n🎉 Sitemap index file (sitemap.xml) generated successfully!');
    console.log(`📊 Total sitemaps generated: ${allSitemaps.length}`);
    allSitemaps.forEach(sitemap => {
      console.log(`   - ${sitemap.filename}`);
    });

  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    // Don't throw to avoid breaking the build process
    console.log('⚠️  Sitemap generation failed, but continuing build...');
  }
}

// Handle both direct execution and module import
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default main;
