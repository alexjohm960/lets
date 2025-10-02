<template>
  <div class="spiel-layout">
    <section class="spiel-section">
      <h2 class="section-title">Latest</h2>
      <div class="spiel-featured-grid">
        <div class="featured-main">
          <FeaturedPostCard 
            v-if="featuredPost"
            :title="featuredPost.term"
            :description="featuredPost.summary"
            :slug="featuredPost.slug"
            :image-url="featuredPost.imageUrl"
            :category="featuredPost.category"
            author="Joan Smith"
          />
        </div>
        <div class="featured-side">
          <CompactPostCard 
            v-for="post in featuredSidePosts" 
            :key="post.slug"
            :title="post.term"
            :slug="post.slug"
            :image-url="post.imageUrl"
            :category="post.category"
            author="Joan Smith"
          />
        </div>
      </div>
    </section>
    
    <section class="spiel-section">
      <h2 class="section-title">Trending</h2>
      <div class="spiel-trending-grid">
        <CompactPostCard 
          v-for="post in trendingPosts" 
          :key="post.slug"
          :title="post.term"
          :slug="post.slug"
          :image-url="post.imageUrl"
          :category="post.category"
          author="Joan Smith"
        />
      </div>
    </section>

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
import FeaturedPostCard from '@/components/ui/FeaturedPostCard.vue';
import CompactPostCard from '@/components/ui/CompactPostCard.vue';
import Pagination from '@/components/ui/Pagination.vue';

const props = defineProps({
  posts: {
    type: Array,
    required: true,
  },
  pagination: {
    type: Object,
    required: true,
  },
});

const featuredPost = computed(() => props.posts[0]);
const featuredSidePosts = computed(() => props.posts.slice(1, 5));
const trendingPosts = computed(() => {
  return [...props.posts]
    .filter(p => p.isPopular)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);
});
</script>

<style scoped>
.spiel-section {
  margin-bottom: 4rem;
}
.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}
.spiel-featured-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
.featured-side {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.spiel-trending-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

@media (min-width: 992px) {
  .spiel-featured-grid {
    grid-template-columns: 2fr 1.5fr;
  }
}
</style>