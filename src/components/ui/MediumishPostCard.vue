<template>
  <router-link :to="`/${post.slug}`" class="post-card">
    <div v-if="post.imageUrl" class="card-image-wrapper">
      <img :src="post.imageUrl" :alt="post.term" class="post-image" loading="lazy" width="400" height="260">
    </div>
    <div class="card-content">
      <h3 class="post-title">{{ post.term }}</h3>
      <p v-if="showExcerpt" class="post-excerpt">{{ post.summary }}</p>
      <div class="post-meta">
        <span class="author-name">Joan Smith</span>
        <span class="meta-separator">·</span>
        <span class="post-date">{{ formattedDate }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  showExcerpt: {
    type: Boolean,
    default: true,
  },
});

const formattedDate = computed(() => {
  if (!props.post.date) return '';
  return new Date(props.post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});
</script>

<style scoped>
.post-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--text-primary);
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  transition: box-shadow 0.2s ease;
}
.post-card:hover {
  box-shadow: 0 4px 12px var(--shadow-color);
}
.card-image-wrapper {
  aspect-ratio: 16 / 10;
  overflow: hidden;
}
.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.post-card:hover .post-image {
  transform: scale(1.05);
}
.card-content {
  padding: 1rem;
}
.post-title {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 0.5rem 0;
}
.post-excerpt {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: auto;
}
</style>