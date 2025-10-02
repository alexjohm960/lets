import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config'; // Pastikan .env terload dengan benar di lokal

// Menggunakan variabel lingkungan Cloudflare Pages jika ada, atau fallback ke .env/default
const SITE_URL = process.env.VITE_SITE_URL || process.env.CF_PAGES_URL || 'https://example.com';
const SITE_NAME = process.env.VITE_SITE_NAME || 'My Awesome Blog';
const SITE_DESCRIPTION = `The latest articles, tips, and insights from ${SITE_NAME}.`;

// Pastikan jalur ini relatif terhadap root proyek yang di-deploy
const DIST_PATH = path.resolve(process.cwd(), 'dist');
const ARTICLES_PATH = path.resolve(process.cwd(), 'public/articles.json'); // Asumsi articles.json ada di public

// Fungsi untuk membersihkan teks agar aman untuk XML (menghapus karakter ilegal)
function escapeXmlText(text) {
  if (typeof text !== 'string') return ''; // Handle non-string input
  return text.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Fungsi untuk membuat blok deskripsi CDATA
function createCdataDescription(summary, imageUrl) {
  const safeSummary = typeof summary === 'string' ? summary : ''; // Pastikan summary adalah string
  const imageTag = imageUrl ? `<img src="${escapeXmlText(imageUrl)}" alt="" /><br/><br/>` : ''; // Escape URL dalam img src juga
  const fullDescription = imageTag + safeSummary;
  return `<![CDATA[${fullDescription}]]>`;
}

async function main() {
  console.log('Generating RSS feed...');
  console.log(`Site URL: ${SITE_URL}`); // Tambahkan logging untuk debugging
  console.log(`Articles path: ${ARTICLES_PATH}`);
  console.log(`Dist path: ${DIST_PATH}`);

  try {
    // Pastikan direktori dist ada sebelum menulis file
    await fs.mkdir(DIST_PATH, { recursive: true });

    const fileContent = await fs.readFile(ARTICLES_PATH, 'utf-8');
    const articles = JSON.parse(fileContent);

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of day for consistency

    const publishedArticles = articles.filter(post => {
      // Validasi lebih kuat untuk properti 'date'
      if (!post.date || typeof post.date !== 'string') {
        // console.warn(`Article missing or invalid date, skipping: ${JSON.stringify(post)}`);
        return false;
      }
      const postDate = new Date(post.date);
      if (isNaN(postDate.getTime())) { // Cek apakah tanggal valid
        // console.warn(`Article has unparseable date, skipping: ${post.date}`);
        return false;
      }
      return postDate <= today;
    });

    const latestArticles = publishedArticles
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Menggunakan getTime() untuk perbandingan yang lebih aman
      .slice(0, 20);

    if (latestArticles.length === 0) {
      console.warn('No published articles found for RSS feed. RSS file will still be generated but may be empty or contain only boilerplate.');
    }

    const feedItems = latestArticles.map(article => {
      // Pastikan properti artikel ada sebelum digunakan
      const term = article.term ? escapeXmlText(article.term) : 'Untitled Article';
      const slug = article.slug ? article.slug : 'no-slug'; // Link harus valid
      const link = `${SITE_URL}/${slug}`;
      const pubDate = article.date ? new Date(article.date).toUTCString() : new Date().toUTCString(); // Fallback date
      const summary = article.summary || '';
      const imageUrl = article.imageUrl || '';

      const enclosure = imageUrl
        ? `<enclosure url="${escapeXmlText(imageUrl)}" length="0" type="image/jpeg" />`
        : '';

      return `
    <item>
      <title>${term}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid> <!-- isPermaLink="true" adalah praktik yang baik -->
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
    console.log(`RSS feed generated successfully with ${latestArticles.length} items! Written to: ${outputPath}`);

  } catch (e) {
    console.error(`ERROR: Could not generate RSS feed. Error: ${e.message}`);
    // Melemparkan error kembali agar build gagal jika RSS tidak dapat dibuat
    // throw e; 
  }
}

main();
