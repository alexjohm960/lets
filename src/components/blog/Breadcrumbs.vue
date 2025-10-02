<template>
  <nav aria-label="breadcrumb" class="breadcrumbs">
    <ol>
      <li v-for="(item, index) in items" :key="item.text">
        <router-link v-if="index < items.length - 1" :to="item.to">{{ item.text }}</router-link>
        <span v-else aria-current="page">{{ item.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
.breadcrumbs {
  margin-bottom: 1.5rem;
}
.breadcrumbs ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.breadcrumbs li {
  font-size: 0.9rem;
  color: var(--text-secondary);
}
.breadcrumbs li:not(:last-child)::after {
  content: '/';
  margin: 0 0.75rem;
  color: var(--border-color);
}
.breadcrumbs a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}
.breadcrumbs a:hover {
  color: var(--primary-color);
  text-decoration: underline;
}
.breadcrumbs span {
  font-weight: 500;
  color: var(--text-primary);
}
</style>