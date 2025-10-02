<template>
  <router-link :to="`/${slug}`" class="featured-post-card">
    <div class="card-image-wrapper">
      <img v-if="imageUrl" :src="imageUrl" :alt="title" class="post-image" loading="eager" width="800" height="450">
      <div v-else class="image-placeholder"></div>
    </div>
    <div class="card-content">
      <span class="post-category">{{ category }}</span>
      <h2 class="post-title">{{ title }}</h2>
      <p class="post-description">{{ description }}</p>
      <span class="post-author">{{ author }}</span>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
  slug: String,
  imageUrl: String,
  category: String,
  author: String,
});
</script>

<style scoped>
/* Tambahkan style spesifik untuk kartu besar di sini jika perlu */
.featured-post-card { text-decoration: none; }
.post-image { width: 100%; height: auto; display: block; }
.post-category { font-size: 0.8rem; text-transform: uppercase; color: var(--text-secondary); margin-top: 1rem; display: block; }
.post-title { font-size: 1.8rem; color: var(--text-primary); margin: 0.5rem 0; }
.post-description { font-size: 1rem; color: var(--text-secondary); line-height: 1.6; }
.post-author { font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem; display: block; }
</style>