<template>
  <router-link :to="`/${slug}`" class="compact-post-card">
    <div class="card-image-wrapper">
      <img v-if="imageUrl" :src="imageUrl" :alt="title" class="post-image" loading="lazy" width="400" height="225">
      <div v-else class="image-placeholder"></div>
    </div>
    <div class="card-content">
      <span class="post-category">{{ category }}</span>
      <h3 class="post-title">{{ title }}</h3>
      <span class="post-author">{{ author }}</span>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  title: String,
  slug: String,
  imageUrl: String,
  category: String,
  author: String,
});
</script>

<style scoped>
/* Tambahkan style spesifik untuk kartu kecil di sini jika perlu */
.compact-post-card { text-decoration: none; }
.post-image { width: 100%; height: auto; display: block; }
.post-category { font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); margin-top: 0.75rem; display: block; }
.post-title { font-size: 1.1rem; color: var(--text-primary); margin: 0.25rem 0; }
.post-author { font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem; display: block; }
</style>