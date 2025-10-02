<template>
  <router-link :to="`/${slug}`" class="post-card">
    <div class="card-image-wrapper">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="title || 'Blog post image'"
        class="post-image"
        loading="lazy"
        width="400"
        height="225"
      />
      <div v-else class="image-placeholder"></div>
    </div>
    <div class="card-content">
      <span class="post-date">{{ formattedDate }}</span>
      <h2 class="post-title">{{ title || 'No Title' }}</h2>
      <p class="post-description">{{ description || 'No description available.' }}</p>
      <span class="read-more">Read Article &rarr;</span>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  title: String,
  description: String,
  date: String,
  slug: String,
  imageUrl: String,
});
const formattedDate = computed(() => {
  if (!props.date || isNaN(new Date(props.date))) {
    return 'Invalid Date';
  }
  return new Date(props.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
});
</script>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
}
.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px var(--shadow-color);
}
.card-image-wrapper {
  aspect-ratio: 16 / 9;
  background-color: var(--border-color);
  width: 100%;
}
.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.post-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  display: block;
}
.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--text-primary);
}
.post-description {
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  flex-grow: 1;
}
.read-more {
  font-weight: 600;
  color: var(--primary-color);
  margin-top: auto;
}
</style>