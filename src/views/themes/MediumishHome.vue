<template>
  <div class="mediumish-home">
    <section v-if="heroPost" class="hero-section">
      <div class="hero-image-wrapper">
        <img :src="heroPost.imageUrl" :alt="heroPost.term" class="hero-image" />
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">{{ heroPost.term }}</h1>
        <p class="hero-excerpt">{{ heroPost.summary }}</p>
        <router-link :to="`/${heroPost.slug}`" class="hero-button">Read More</router-link>
      </div>
    </section>

    <div v-for="(group, index) in postGroups" :key="group.categorySlug + index">
      <section v-if="group.posts.length > 0" class="category-section">
        <div class="section-header">
          <h2 class="section-title">{{ group.categoryName }}</h2>
          <router-link :to="`/category/${group.categorySlug}`" class="view-all-link">View all &rarr;</router-link>
        </div>
        
        <div v-if="layoutPatterns[index % layoutPatterns.length] === '1x4'" class="layout-1x4">
          <div class="main-post">
            <MediumishPostCard :post="group.posts[0]" :showExcerpt="true" />
          </div>
          <div class="side-posts-4">
            <MediumishPostCard v-for="post in group.posts.slice(1, 5)" :key="post.slug" :post="post" :showExcerpt="false" />
          </div>
        </div>

        <div v-else-if="layoutPatterns[index % layoutPatterns.length] === '2x2'" class="layout-2x2">
          <HorizontalPostCard v-for="post in group.posts.slice(0, 4)" :key="post.slug" :post="post" />
        </div>

        <div v-else class="layout-4x1">
          <MediumishPostCard v-for="post in group.posts.slice(0, 4)" :key="post.slug" :post="post" :showExcerpt="false" />
        </div>
      </section>
    </div>
    
    <Pagination
      v-if="pagination.totalPages > 1"
      :currentPage="pagination.currentPage"
      :totalPages="pagination.totalPages"
      :basePath="pagination.basePath"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import MediumishPostCard from '@/components/ui/MediumishPostCard.vue';
import HorizontalPostCard from '@/components/ui/HorizontalPostCard.vue';
import Pagination from '@/components/ui/Pagination.vue';

const props = defineProps({
  posts: {
    type: Array,
    required: true
  },
  pagination: {
    type: Object,
    required: true
  }
});

const layoutPatterns = ['1x4', '2x2', '4x1'];

const heroPost = computed(() => {
  return props.pagination.currentPage === 1 ? props.posts[0] : null;
});

const remainingPosts = computed(() => {
  return props.pagination.currentPage === 1 ? props.posts.slice(1) : props.posts;
});

const postGroups = computed(() => {
  const groups = [];
  let postPool = [...remainingPosts.value];
  const processedSlugs = new Set();
  
  while(postPool.length > 0) {
    const mainPost = postPool.find(p => !processedSlugs.has(p.slug));
    if (!mainPost) break;

    const categorySlug = mainPost.categorySlug;
    const group = {
      categoryName: mainPost.category,
      categorySlug: categorySlug,
      posts: []
    };
    
    const postsFromSameCategory = postPool.filter(p => p.categorySlug === categorySlug && !processedSlugs.has(p.slug));
    group.posts.push(...postsFromSameCategory);
    postsFromSameCategory.forEach(p => processedSlugs.add(p.slug));
    
    const requiredPosts = layoutPatterns[groups.length % layoutPatterns.length] === '1x4' ? 5 : 4;
    
    if (group.posts.length < requiredPosts) {
      const needed = requiredPosts - group.posts.length;
      const fillPosts = postPool.filter(p => !processedSlugs.has(p.slug)).slice(0, needed);
      group.posts.push(...fillPosts);
      fillPosts.forEach(p => processedSlugs.add(p.slug));
    }
    
    if (group.posts.length > 0) {
      groups.push(group);
    }
    
    postPool = postPool.filter(p => !processedSlugs.has(p.slug));
  }
  
  return groups;
});
</script>

<style scoped>
.hero-section {
  position: relative; width: 100%; height: 450px; overflow: hidden; color: white;
  display: flex; align-items: center; margin-bottom: 3rem; border: 1px solid var(--border-color);
}
.hero-image-wrapper { position: absolute; inset: 0; }
.hero-image { width: 100%; height: 100%; object-fit: cover; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.1)); }
.hero-content { position: relative; z-index: 2; padding: 2rem; max-width: 50%; }
.hero-title { font-size: 2.5rem; line-height: 1.2; margin: 0 0 1rem 0; color: #fff; }
.hero-excerpt { font-size: 1rem; margin-bottom: 1.5rem; }
.hero-button { background-color: var(--primary-color); color: var(--text-primary); padding: 0.75rem 1.5rem; text-decoration: none; font-weight: bold; }

.category-section { margin-bottom: 3rem; }
.section-header {
  display: flex; justify-content: space-between; align-items: baseline;
  border-bottom: 1px solid var(--border-color); margin-bottom: 1.5rem; padding-bottom: 0.5rem;
}
.section-title { font-size: 1.5rem; font-weight: bold; margin: 0; }
.view-all-link { font-size: 0.9rem; font-weight: bold; text-decoration: none; }

.layout-1x4 { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
.side-posts-4 { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
.layout-2x2 { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
.layout-4x1 { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }

@media (min-width: 500px) {
  .side-posts-4 { grid-template-columns: 1fr 1fr; }
  .layout-2x2 { grid-template-columns: 1fr 1fr; }
  .layout-4x1 { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 992px) {
  .layout-1x4 { grid-template-columns: 1fr 1fr; }
  .layout-4x1 { grid-template-columns: 1fr 1fr 1fr 1fr; }
}
</style>