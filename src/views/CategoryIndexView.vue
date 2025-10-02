<template>
  <div class="category-index-page">
    <header class="page-header">
      <h1>Explore Our Categories</h1>
      <p>Discover our in-depth coverage on a variety of subjects.</p>
    </header>

    <div v-if="isLoading && !isLoaded" class="loading-state">
      <p>Loading categories...</p>
    </div>

    <div v-else-if="categories.length > 0" class="category-grid">
      <router-link v-for="category in categories" :key="category.slug" :to="`/category/${category.slug}`" class="category-card">
        <h2>{{ category.name }}</h2>
        <p>{{ category.count }} Articles</p>
      </router-link>
    </div>

    <div v-else class="no-posts">
      <p>No categories found.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useHead } from '@unhead/vue';
import { useArticles } from '@/composables/useArticles.js';

const { articles: allPosts, isLoading, isLoaded, fetchArticles } = useArticles();

onMounted(() => {
  fetchArticles();
});

const siteName = import.meta.env.VITE_SITE_NAME || 'KontenKit';
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.kontenkit.com';

const categories = computed(() => {
  if (allPosts.value.length === 0) return [];

  const categoryMap = new Map();

  allPosts.value.forEach(post => {
    if (post.category && post.categorySlug) {
      if (!categoryMap.has(post.categorySlug)) {
        categoryMap.set(post.categorySlug, {
          name: post.category,
          slug: post.categorySlug,
          count: 0
        });
      }
      categoryMap.get(post.categorySlug).count++;
    }
  });

  return Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
});

useHead({
  title: `All Categories | ${siteName}`,
  link: [{ rel: 'canonical', href: `${siteUrl}/categories` }],
  meta: [
    { name: 'description', content: `Explore all content categories from ${siteName}, covering topics from technology to finance and more.` },
    { property: 'og:title', content: `All Categories | ${siteName}` },
    { property: 'og:description', content: `Explore all content categories from ${siteName}.` },
  ],
});
</script>

<style scoped>
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}
.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.page-header p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: auto;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.category-card {
  display: block;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px var(--shadow-color);
}
.category-card h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: var(--primary-color);
}
.category-card p {
  color: var(--text-secondary);
  margin: 0;
}
.loading-state,
.no-posts {
  text-align: center;
  margin-top: 4rem;
  color: var(--text-secondary);
}
</style>