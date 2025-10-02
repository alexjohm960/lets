<template>
  <nav class="pagination-nav">
    <div class="nav-link prev">
      <!-- PERBAIKAN: Hapus /${nicheId}/blog/ dari path -->
      <router-link v-if="prev" :to="`/${prev.slug}`">
        <span class="label">&larr; Previous Post</span>
        <span class="title">{{ prev.term }}</span>
      </router-link>
    </div>
    <div class="nav-link next">
      <!-- PERBAIKAN: Hapus /${nicheId}/blog/ dari path -->
      <router-link v-if="next" :to="`/${next.slug}`">
        <span class="label">Next Post &rarr;</span>
        <span class="title">{{ next.term }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
// PERBAIKAN: Hapus prop nicheId yang tidak digunakan
defineProps({
  prev: Object,
  next: Object
});
</script>

<style scoped>
.pagination-nav { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 2rem; }
@media (min-width: 768px) { .pagination-nav { grid-template-columns: 1fr 1fr; } }
.nav-link a { display: block; padding: 1.5rem; border: 1px solid var(--border-color); border-radius: 8px; text-decoration: none; transition: all 0.2s ease; height: 100%; }
.nav-link a:hover { border-color: var(--primary-color); background-color: var(--background-light); }
.nav-link.next { text-align: right; }
.label { display: block; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
.title { color: var(--text-primary); font-weight: 600; }
</style>