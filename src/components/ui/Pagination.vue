<template>
  <nav v-if="totalPages > 1" class="pagination-container" aria-label="Pagination">
    <ul class="pagination-list">
      <li v-if="currentPage > 1">
        <router-link :to="getPageLink(1)" class="pagination-link">&laquo; First</router-link>
      </li>
      <li v-if="currentPage > 1">
        <router-link :to="getPageLink(currentPage - 1)" class="pagination-link">&lsaquo; Prev</router-link>
      </li>

      <li v-for="page in pages" :key="page">
        <router-link
          :to="getPageLink(page)"
          :class="['pagination-link', { 'is-current': page === currentPage }]"
        >
          {{ page }}
        </router-link>
      </li>

      <li v-if="currentPage < totalPages">
        <router-link :to="getPageLink(currentPage + 1)" class="pagination-link">Next &rsaquo;</router-link>
      </li>
      <li v-if="currentPage < totalPages">
        <router-link :to="getPageLink(totalPages)" class="pagination-link">Last &raquo;</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  basePath: {
    type: String,
    default: '/page/',
  },
});

const route = useRoute();

const pages = computed(() => {
  const range = 2;
  const pagesArray = [];
  for (let i = Math.max(1, props.currentPage - range); i <= Math.min(props.totalPages, props.currentPage + range); i++) {
    pagesArray.push(i);
  }
  return pagesArray;
});

const getPageLink = (pageNumber) => {
  if (pageNumber === 1) {
    return props.basePath.replace('/page/', '/');
  }
  return `${props.basePath}${pageNumber}`;
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}
.pagination-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
.pagination-link {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: var(--border-radius);
  transition: background-color 0.2s ease, color 0.2s ease;
}
.pagination-link:hover {
  background-color: var(--background-light);
  color: var(--text-primary);
}
.pagination-link.is-current {
  background-color: var(--primary-color);
  color: #fff;
  font-weight: bold;
}
</style>