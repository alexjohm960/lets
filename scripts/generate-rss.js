import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';

// Menggunakan variabel lingkungan Cloudflare Pages jika ada, atau fallback ke .env/default
const SITE_URL = process.env.VITE_SITE_URL || process.env.CF_PAGES_URL || 'https://lets.web.id';
const SITE_NAME = process.env.VITE_SITE_NAME || 'Lets Blog';
const SITE_DESCRIPTION = `The latest articles, tips, and insights from ${SITE_NAME}.`;

// Pastikan jalur ini relatif terhadap root proyek yang di-deploy
const DIST_PATH = path.resolve(process.cwd(), 'dist');
const ARTICLES_PATH = path.resolve(process.cwd(), 'public/articles.json');

// Fungsi untuk membersihkan teks agar aman untuk XML (menghapus karakter ilegal)
function escapeXmlText(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Fungsi untuk membuat blok deskripsi CDATA
function createCdataDescription(summary, imageUrl) {
  const safeSummary = typeof summary === 'string' ? summary : '';
  const imageTag = imageUrl ? `<img src="${escapeXmlText(imageUrl)}" alt="" /><br/><br/>` : '';
  const fullDescription = imageTag + safeSummary;
  return `<![CDATA[${fullDescription}]]>`;
}

async function main() {
  console.log('Generating RSS feed...');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`Articles path: ${ARTICLES_PATH}`);
  console.log(`Dist path: ${DIST_PATH}`);

  try {
    // Pastikan direktori dist ada sebelum menulis file
    await fs.mkdir(DIST_PATH, { recursive: true });

    // Check if articles.json exists
    let articles = [];
    try {
      await fs.access(ARTICLES_PATH);
      const fileContent = await fs.readFile(ARTICLES_PATH, 'utf-8');
      articles = JSON.parse(fileContent);
      console.log(`📚 Found ${articles.length} articles in articles.json`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('⏭️  articles.json not found, generating empty RSS feed');
        console.log('💡 Tip: Add keywords to keyword.txt and rebuild to generate articles');
      } else {
        console.error('❌ Error reading articles.json:', error.message);
        // Don't throw - continue with empty articles
      }
    }

    // If no articles found, create empty RSS feed or skip
    if (articles.length === 0) {
      console.log('📭 No articles found, generating basic RSS feed');
      
      const emptyRssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXmlText(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXmlText(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <item>
      <title>Welcome to ${escapeXmlText(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
      <guid isPermaLink="true">${SITE_URL}/welcome</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description><![CDATA[Welcome to our blog! New content coming soon.]]></description>
    </item>
  </channel>
</rss>`;

      const outputPath = path.join(DIST_PATH, 'rss.xml');
      await fs.writeFile(outputPath, emptyRssFeed.trim());
      console.log(`✅ Basic RSS feed generated at: ${outputPath}`);
      console.log('💡 Add keywords to keyword.txt to generate article content');
      return;
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Filter articles that are published (date <= today)
    const publishedArticles = articles.filter(post => {
      if (!post.date || typeof post.date !== 'string') {
        console.warn(`⚠️  Article missing or invalid date, skipping: ${post.term || 'Unknown'}`);
        return false;
      }
      const postDate = new Date(post.date);
      if (isNaN(postDate.getTime())) {
        console.warn(`⚠️  Article has unparseable date, skipping: ${post.date}`);
        return false;
      }
      return postDate <= today;
    });

    console.log(`📅 Found ${publishedArticles.length} published articles`);

    // Get latest articles (max 20)
    const latestArticles = publishedArticles
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);

    if (latestArticles.length === 0) {
      console.log('📭 No published articles found, generating basic RSS feed');
      
      const basicRssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXmlText(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXmlText(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <item>
      <title>Welcome to ${escapeXmlText(SITE_NAME)}</title>
      <link>${SITE_URL}</link>
      <guid isPermaLink="true">${SITE_URL}/welcome</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description><![CDATA[Welcome to our blog! We're preparing amazing content for you.]]></description>
    </item>
  </channel>
</rss>`;

      const outputPath = path.join(DIST_PATH, 'rss.xml');
      await fs.writeFile(outputPath, basicRssFeed.trim());
      console.log(`✅ Basic RSS feed generated at: ${outputPath}`);
      return;
    }

    // Generate RSS items from articles
    const feedItems = latestArticles.map(article => {
      const term = article.term ? escapeXmlText(article.term) : 'Untitled Article';
      const slug = article.slug ? article.slug : 'no-slug';
      const link = `${SITE_URL}/${slug}`;
      const pubDate = article.date ? new Date(article.date).toUTCString() : new Date().toUTCString();
      const summary = article.summary || '';
      const imageUrl = article.imageUrl || '';

      const enclosure = imageUrl
        ? `<enclosure url="${escapeXmlText(imageUrl)}" length="0" type="image/jpeg" />`
        : '';

      return `
    <item>
      <title>${term}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${createCdataDescription(summary, imageUrl)}</description>
      ${enclosure}
    </item>
      `;
    }).join('');

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXmlText(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXmlText(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${feedItems}
  </channel>
</rss>`;

    const outputPath = path.join(DIST_PATH, 'rss.xml');
    await fs.writeFile(outputPath, rssFeed.trim());
    console.log(`✅ RSS feed generated successfully with ${latestArticles.length} items!`);
    console.log(`📁 Written to: ${outputPath}`);

  } catch (error) {
    console.error(`❌ ERROR: Could not generate RSS feed. Error: ${error.message}`);
    console.log('⚠️  RSS generation failed, but build continues...');
    
    // Create a minimal RSS feed as fallback
    try {
      const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>RSS Feed - Check back later for content</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;
      
      const outputPath = path.join(DIST_PATH, 'rss.xml');
      await fs.writeFile(outputPath, fallbackRss);
      console.log('📝 Created fallback RSS feed');
    } catch (fallbackError) {
      console.error('❌ Could not create fallback RSS feed:', fallbackError.message);
    }
  }
}

// Handle uncaught errors gracefully
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception in RSS generation:', error.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection in RSS generation at:', promise, 'reason:', reason);
});

main().catch(error => {
  console.error('❌ RSS generation process failed:', error.message);
  console.log('⚠️  Continuing build without RSS feed...');
  // Don't break the build process
});
