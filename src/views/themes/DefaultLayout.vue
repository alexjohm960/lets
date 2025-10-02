<template>
  <div>
    <header class="page-header">
      <h1>{{ pageTitle }}</h1>
      <p v-if="pageDescription">{{ pageDescription }}</p>
    </header>

    <div class="posts-grid">
      <BlogPostCard
        v-for="post in posts"
        :key="post.slug"
        :title="post.term || post.title"
        :description="post.summary"
        :date="post.date"
        :slug="post.slug"
        :image-url="post.imageUrl"
      />
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
import BlogPostCard from '@/components/ui/BlogPostCard.vue';
import Pagination from '@/components/ui/Pagination.vue';

defineProps({
  posts: Array,
  pagination: Object,
  pageTitle: String,
  pageDescription: String,
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
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
</style>