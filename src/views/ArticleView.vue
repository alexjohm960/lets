<template>
  <div v-if="isLoading && !isLoaded" class="loading-state">
    <p>Loading article...</p>
  </div>
  <div v-else-if="articleData" class="article-page">
    <Breadcrumbs :items="breadcrumbs" />
    <div class="article-layout">
      <main class="main-content">
        <div class="article-wrapper">
          <p class="article-category">{{ articleData.category }}</p>
          <h1>{{ articleData.term || articleData.title }}</h1>
          <img
            v-if="articleData.imageUrl"
            :src="articleData.imageUrl"
            :alt="articleData.term || articleData.title"
            class="featured-image"
            width="800"
            height="450"
          />
          <p class="publish-date">Published on: {{ formattedDate }}</p>
          <p class="summary"><em>{{ articleData.summary }}</em></p>
          <TableOfContents :articleData="articleData" class="toc-mobile" />
          <div class="article-content" v-html="mainContentHtmlWithIds"></div>
          <AdRenderer v-if="adSlots.inArticle.enabled" slotName="in-article" />
          <div v-if="articleData.prosCons && articleData.prosCons.length" class="pros-cons-section">
            <h2 :id="findHeadingId(`Pros & Cons of ${articleData.term}`)">Pros & Cons of {{ articleData.term }}</h2>
            <div v-for="item in articleData.prosCons" :key="item.point" class="pros-cons-item">
              <h3 :id="findHeadingId(item.point)">{{ item.point }}</h3>
              <p>{{ item.explanation }}</p>
            </div>
          </div>
          <div v-if="articleData.faq && articleData.faq.length" class="faq-section">
            <h2 :id="findHeadingId('Frequently Asked Questions')">Frequently Asked Questions</h2>
            <div v-for="item in articleData.faq" :key="item.question" class="faq-item">
              <h3 :id="findHeadingId(item.question)">{{ item.question }}</h3>
              <p>{{ item.answer }}</p>
            </div>
          </div>
          <div v-if="articleData.tags && articleData.tags.length > 0" class="tags-section">
            <h3 class="section-title">Tags</h3>
            <div class="tags-container">
              <span v-for="tag in articleData.tags" :key="tag" class="tag-item">{{ tag }}</span>
            </div>
          </div>
          <SocialShare :title="articleData.term || articleData.title" />
        </div>

        <div v-if="relatedPosts.length > 0" class="related-posts-section">
          <h2 class="section-title">Related Post</h2>
          <div class="related-posts-grid">
            <RelatedPostCard
              v-for="post in relatedPosts"
              :key="post.slug"
              :title="post.term || post.title"
              :slug="post.slug"
              :image-url="post.imageUrl"
            />
          </div>
        </div>

        <ArticlePagination :prev="pagination.prev" :next="pagination.next" />
      </main>
      <aside class="sidebar-wrapper">
        <TableOfContents :articleData="articleData" class="toc-desktop" />
        <BlogSidebar />
      </aside>
    </div>
  </div>
  <div v-else class="article-wrapper">
    <h1>Article Not Found</h1>
    <p>Sorry, we couldn't find the article you were looking for.</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import MarkdownIt from 'markdown-it';
import BlogSidebar from '@/components/blog/BlogSidebar.vue';
import SocialShare from '@/components/ui/SocialShare.vue';
import ArticlePagination from '@/components/blog/ArticlePagination.vue';
import Breadcrumbs from '@/components/blog/Breadcrumbs.vue';
import TableOfContents from '@/components/blog/TableOfContents.vue';
import AdRenderer from '@/components/ads/AdRenderer.vue';
import RelatedPostCard from '@/components/ui/RelatedPostCard.vue';
import { adSlots } from '@/adConfig.js';
import { useArticles } from '@/composables/useArticles.js';

const props = defineProps({
  slug: String
});

const { articles: allArticles, isLoading, isLoaded, fetchArticles } = useArticles();

onMounted(() => {
  fetchArticles();
});

const md = new MarkdownIt({ html: true });
const siteName = import.meta.env.VITE_SITE_NAME || 'KontenKit';
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.kontenkit.com';

const articleData = computed(() => {
  return allArticles.value.find(article => article.slug === props.slug);
});

const formattedDate = computed(() => {
  if (!articleData.value?.date) return '';
  return new Date(articleData.value.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});

const sortedPublishedPosts = computed(() => {
  const today = new Date();
  today.setHours(23, 59, 59, 999); 
  
  return allArticles.value
    .filter(post => post.date && new Date(post.date) <= today)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
});

const pagination = computed(() => {
  const currentIndex = sortedPublishedPosts.value.findIndex(p => p.slug === props.slug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex < sortedPublishedPosts.value.length - 1 
    ? sortedPublishedPosts.value[currentIndex + 1] 
    : null;

  const next = currentIndex > 0 
    ? sortedPublishedPosts.value[currentIndex - 1] 
    : null;
    
  return { prev, next };
});

const relatedPosts = computed(() => {
  if (!articleData.value) return [];
  return sortedPublishedPosts.value
    .filter(post => post.categorySlug === articleData.value.categorySlug && post.slug !== articleData.value.slug)
    .slice(0, 6);
});

const mainContentMarkdown = computed(() => {
  if (!articleData.value) return '';
  return `${articleData.value.deepDive || ''}\n\n${articleData.value.importance || ''}`;
});

const createSlugId = (text = '') => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const allHeadingsForArticle = computed(() => {
  if (!articleData.value) return [];
  const h = [];
  const headingRegex = /^(##|###)\s+(.*)/gm;
  [...mainContentMarkdown.value.matchAll(headingRegex)].forEach(m => h.push({ id: createSlugId(m[2]), text: m[2].trim(), level: m[1].length }));
  if (articleData.value.prosCons?.length) {
    const title = `Pros & Cons of ${articleData.value.term}`;
    h.push({ id: createSlugId(title), text: title, level: 2 });
    articleData.value.prosCons.forEach(i => h.push({ id: createSlugId(i.point), text: i.point, level: 3 }));
  }
  if (articleData.value.faq?.length) {
    const title = 'Frequently Asked Questions';
    h.push({ id: createSlugId(title), text: title, level: 2 });
    articleData.value.faq.forEach(i => h.push({ id: createSlugId(i.question), text: i.question, level: 3 }));
  }
  return h;
});

const findHeadingId = (text) => {
  const heading = allHeadingsForArticle.value.find(h => h.text === text);
  return heading ? heading.id : '';
};

const mainContentHtmlWithIds = computed(() => {
  if (!mainContentMarkdown.value) return '';
  let html = md.render(mainContentMarkdown.value);
  allHeadingsForArticle.value.forEach(h => {
    if(mainContentMarkdown.value.includes(h.text)) {
      html = html.replace(`<h${h.level}>${h.text}</h${h.level}>`, `<h${h.level} id="${h.id}">${h.text}</h${h.level}>`);
    }
  });
  return html;
});

const breadcrumbs = computed(() => {
  if (!articleData.value) return [];
  return [
    { text: 'Home', to: '/' },
    { text: 'Categories', to: '/categories' },
    { text: articleData.value.category, to: `/category/${articleData.value.categorySlug}` },
    { text: articleData.value.term || articleData.value.title },
  ];
});

useHead(() => {
  if (!articleData.value) return { title: 'Article Not Found' };
  
  const articleUrl = `${siteUrl}/${articleData.value.slug}`;
  const pageTitle = `${articleData.value.term || articleData.value.title} | ${siteName}`;
  const pageDescription = articleData.value.summary;
  const imageUrl = articleData.value.imageUrl || `${siteUrl}/logo.png`;

  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": breadcrumbs.value.map((item, index) => ({ "@type": "ListItem", "position": index + 1, "name": item.text, ...(index < breadcrumbs.value.length - 1 && { "item": `${siteUrl}${item.to}` }) })) };
  const faqSchema = (articleData.value.faq?.length > 0) ? { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": articleData.value.faq.map(item => ({ "@type": "Question", "name": item.question, "acceptedAnswer": { "@type": "Answer", "text": item.answer } })) } : null;
  const articleSchema = { "@context": "https://schema.org", "@type": "Article", "headline": articleData.value.term || articleData.value.title, "image": imageUrl, "datePublished": articleData.value.date, "author": { "@type": "Organization", "name": siteName }, "description": pageDescription, "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl }, ...(faqSchema && { mainEntity: faqSchema }) };
  
  return {
    title: pageTitle,
    link: [{ rel: 'canonical', href: articleUrl }],
    meta: [
      { name: 'description', content: pageDescription },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: pageDescription },
      { property: 'og:url', content: articleUrl },
      { property: 'og:type', content: 'article' },
      { property: 'og:image', content: imageUrl },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: pageDescription },
      { name: 'twitter:image', content: imageUrl },
    ],
    script: [
      { type: 'application/ld+json', children: JSON.stringify([articleSchema, breadcrumbSchema].filter(Boolean)) }
    ]
  }
});
</script>

<style scoped>
.article-layout { display: flex; flex-direction: column; gap: 2rem; }
.main-content { flex: 1; min-width: 0; }
.sidebar-wrapper { flex-basis: 320px; flex-shrink: 0; }
.toc-mobile { margin-bottom: 2rem; display: block; }
.toc-desktop { display: none; margin-bottom: 2rem; }
.loading-state { text-align: center; padding: 4rem 0; color: var(--text-secondary); }
@media (min-width: 992px) {
  .article-layout { flex-direction: row; gap: 3rem; }
  .main-content { flex: 1; }
  .sidebar-wrapper { order: 2; }
  .toc-mobile { display: none; }
  .toc-desktop { display: block; }
}
.article-wrapper { background-color: var(--card-background); padding: 1.5rem; border-radius: var(--border-radius); border: 1px solid var(--border-color); }
@media (min-width: 768px) { .article-wrapper { padding: 2.5rem; } }
.article-category { color: var(--primary-color); font-weight: 600; text-transform: uppercase; font-size: 0.9rem; }
.article-wrapper h1 { margin-top: 0.5rem; font-size: 2rem; }
@media (min-width: 768px) { .article-wrapper h1 { font-size: 2.5rem; } }
.featured-image {
  width: 100%;
  height: auto;
  margin-top: 1.5rem;
  border-radius: var(--border-radius);
  background-color: var(--border-color);
}
.publish-date { color: var(--text-secondary); font-style: italic; margin-bottom: var(--spacing-lg); }
.summary { font-size: var(--font-size-lg); color: var(--text-secondary); border-left: 3px solid var(--primary-color); padding-left: var(--spacing-md); margin: var(--spacing-lg) 0; }
.pros-cons-section, .faq-section { margin-top: var(--spacing-lg); border-top: 1px solid var(--border-color); padding-top: var(--spacing-md); }
.pros-cons-item, .faq-item { margin-bottom: 1.5rem; }
.pros-cons-item h3, .faq-item h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }

.section-title {
  font-size: 1.75rem;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.tags-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.tag-item {
  background-color: var(--background-light);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.related-posts-section {
  margin-top: 2rem;
}
.related-posts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .related-posts-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>