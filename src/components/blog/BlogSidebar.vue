<template>
  <aside class="blog-sidebar">
    <div v-if="popularPosts.length > 0" class="sidebar-widget">
      <h3 class="widget-title">Popular Posts</h3>
      <ul class="post-list-detailed">
        <li v-for="post in popularPosts" :key="post.slug">
          <router-link :to="`/${post.slug}`" class="post-link">
            <div class="post-image-wrapper">
              <img v-if="post.imageUrl" :src="post.imageUrl" :alt="post.term" class="post-image" loading="lazy" width="80" height="80">
              <div v-else class="image-placeholder"></div>
            </div>
            <div class="post-details">
              <span class="post-title">{{ post.term || post.title }}</span>
              <span class="post-category">{{ post.category }}</span>
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <AdRenderer v-if="adSlots.sidebar.enabled" slotName="sidebar" />

    <div v-if="recentPosts.length > 0" class="sidebar-widget">
      <h3 class="widget-title">Recent Posts</h3>
      <ul class="post-list-detailed">
        <li v-for="post in recentPosts" :key="post.slug">
          <router-link :to="`/${post.slug}`" class="post-link">
            <div class="post-image-wrapper">
              <img v-if="post.imageUrl" :src="post.imageUrl" :alt="post.term" class="post-image" loading="lazy" width="80" height="80">
              <div v-else class="image-placeholder"></div>
            </div>
            <div class="post-details">
              <span class="post-title">{{ post.term || post.title }}</span>
              <span class="post-date">{{ formatDate(post.date) }}</span>
            </div>
          </router-link>
        </li>
      </ul>
    </div>

    <div v-if="categories.length > 0" class="sidebar-widget">
      <h3 class="widget-title">Categories</h3>
      <ul class="category-list">
        <li v-for="category in categories" :key="category.slug">
          <router-link :to="`/category/${category.slug}`">{{ category.name }}</router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import AdRenderer from '@/components/ads/AdRenderer.vue';
import { adSlots } from '@/adConfig.js';
import { useArticles } from '@/composables/useArticles.js';

const { articles: allPosts, fetchArticles } = useArticles();

onMounted(() => {
  fetchArticles();
});

const publishedPosts = computed(() => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return allPosts.value.filter(post => {
    if (!post.date) return false;
    const postDate = new Date(post.date);
    return postDate <= today;
  });
});

const popularPosts = computed(() => {
  return publishedPosts.value.filter(post => post.isPopular === true).slice(0, 5);
});

const recentPosts = computed(() => {
  return [...publishedPosts.value]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
});

const categories = computed(() => {
  if (publishedPosts.value.length === 0) return [];
  const categoryMap = new Map();
  publishedPosts.value.forEach(post => {
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};
</script>

<style scoped>
.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.sidebar-widget {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}
.widget-title {
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}
.post-list-detailed, .category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.post-list-detailed li {
  margin-bottom: 1rem;
}
.post-list-detailed li:last-child {
  margin-bottom: 0;
}
.post-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
}
.post-image-wrapper {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--border-color);
}
.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.post-details {
  display: flex;
  flex-direction: column;
}
.post-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  line-height: 1.4;
  transition: color 0.2s ease;
}
.post-link:hover .post-title {
  color: var(--primary-color);
}
.post-category, .post-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.category-list a {
  text-decoration: none;
  color: var(--text-primary);
  background-color: var(--background-light);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}
.category-list a:hover {
  background-color: var(--primary-color);
  color: #fff;
  text-decoration: none;
}
</style>