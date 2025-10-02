<template>
  <div class="blog-index-page">
    <div v-if="isLoading && !isLoaded" class="loading-state">
      <p>Loading articles...</p>
    </div>

    <div v-else-if="sortedPosts.length > 0">
      <MediumishHome 
        v-if="!props.categorySlug"
        :posts="paginatedPosts" 
        :pagination="paginationData"
      />
      <DefaultLayout
        v-else
        :posts="paginatedPosts"
        :pagination="paginationData"
        :pageTitle="pageTitle"
        :pageDescription="pageDescription"
      />
    </div>
    
    <div v-else class="no-posts">
      <p>No articles published yet. Please check back later!</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { useArticles } from '@/composables/useArticles.js';

import DefaultLayout from '@/views/themes/DefaultLayout.vue';
import MediumishHome from '@/views/themes/MediumishHome.vue';

const props = defineProps({
  categorySlug: String,
  page: [String, Number]
});

const { articles: allPosts, isLoading, isLoaded, fetchArticles } = useArticles();

onMounted(() => {
  fetchArticles();
});

const route = useRoute();
const siteName = import.meta.env.VITE_SITE_NAME || 'KontenKit';
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.kontenkit.com';
const postsPerPage = 12;

const currentPage = computed(() => {
  const pageNumber = parseInt(props.page || route.params.page || '1');
  return isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
});

const publishedPosts = computed(() => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return allPosts.value.filter(post => post.date && new Date(post.date) <= today);
});

const sortedPosts = computed(() => {
  const basePosts = props.categorySlug
    ? publishedPosts.value.filter(post => post.categorySlug === props.categorySlug)
    : publishedPosts.value;
  return [...basePosts].sort((a, b) => new Date(b.date) - new Date(a.date));
});

const totalPages = computed(() => {
  return Math.ceil(sortedPosts.value.length / postsPerPage);
});

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  const end = start + postsPerPage;
  return sortedPosts.value.slice(start, end);
});

const paginationBasePath = computed(() => {
  return props.categorySlug ? `/category/${props.categorySlug}/page/` : '/page/';
});

const paginationData = computed(() => ({
  currentPage: currentPage.value,
  totalPages: totalPages.value,
  basePath: paginationBasePath.value,
}));

const pageTitle = computed(() => {
  if (props.categorySlug) {
    const post = allPosts.value.find(p => p.categorySlug === props.categorySlug);
    return post ? `Category: ${post.category}` : `Category: ${props.categorySlug}`;
  }
  if (currentPage.value > 1) {
    return `The ${siteName} Blog - Page ${currentPage.value}`;
  }
  return `The ${siteName} Blog`;
});

const pageDescription = computed(() => {
  return props.categorySlug ? `All articles in the "${pageTitle.value}" category.` : `The latest articles, tips, and insights from ${siteName}.`;
});

useHead(() => {
  const url = props.categorySlug ? `${siteUrl}/category/${props.categorySlug}` : siteUrl;
  const imageUrl = `${siteUrl}/logo.png`;

  return {
    title: pageTitle.value,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'description', content: pageDescription.value },
      { property: 'og:title', content: pageTitle.value },
      { property: 'og:description', content: pageDescription.value },
      { property: 'og:url', content: url },
      { property: 'og:image', content: imageUrl },
    ],
  };
});
</script>

<style scoped>
.loading-state,
.no-posts {
  text-align: center;
  margin-top: 4rem;
  color: var(--text-secondary);
}
</style>