<template>
  <router-link :to="`/${slug}`" class="related-post-card">
    <div class="related-image-wrapper">
      <img v-if="imageUrl" :src="imageUrl" :alt="title" class="related-image" loading="lazy" width="150" height="100">
      <div v-else class="image-placeholder"></div>
    </div>
    <h3 class="related-title">{{ title }}</h3>
  </router-link>
</template>

<script setup>
defineProps({
  title: String,
  slug: String,
  imageUrl: String,
});
</script>

<style scoped>
.related-post-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  background-color: var(--card-background);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.related-post-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px var(--shadow-color);
}
.related-image-wrapper {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  background-color: var(--border-color);
}
.related-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.related-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.2s ease;
}
.related-post-card:hover .related-title {
  color: var(--primary-color);
}
</style>