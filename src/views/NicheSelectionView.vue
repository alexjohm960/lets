<template>
  <div class="niche-selection-page">
    <header class="page-header">
      <h1>Welcome to Our Content Hub</h1>
      <p>Explore our collection of specialized sites, each dedicated to providing expert insights and valuable resources.</p>
    </header>
    <div class="niche-grid">
      <router-link v-for="niche in niches" :key="niche.id" :to="`/${niche.id}/`" class="niche-card">
        <h2>{{ niche.siteName }}</h2>
        <p>{{ niche.description }}</p>
        <span class="explore-link">Explore Site &rarr;</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import niches from '../../niches.json';
import { useHead } from '@unhead/vue';

const siteName = import.meta.env.VITE_SITE_NAME || 'KontenKit';
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.kontenkit.com';

useHead({
  title: `Content Hub | ${siteName}`,
  link: [{ rel: 'canonical', href: siteUrl }],
  meta: [
      { name: 'description', content: 'Explore our collection of specialized content sites covering technology, finance, marketing, and more.' },
      { property: 'og:title', content: `Content Hub | ${siteName}` },
      { property: 'og:description', content: 'Explore our collection of specialized content sites covering technology, finance, marketing, and more.' },
  ],
});
</script>

<style scoped>
.page-header { text-align: center; margin-bottom: 3rem; }
.page-header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
.page-header p { font-size: 1.1rem; color: var(--text-secondary); max-width: 600px; margin: auto; }
.niche-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
.niche-card { display: flex; flex-direction: column; background-color: var(--card-background); border: 1px solid var(--border-color); border-radius: 12px; padding: 2rem; text-decoration: none; color: var(--text-primary); transition: transform 0.2s ease, box-shadow 0.2s ease; }
.niche-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px var(--shadow-color); }
.niche-card h2 { margin: 0 0 0.75rem 0; font-size: 1.5rem; color: var(--primary-color); }
.niche-card p { color: var(--text-secondary); flex-grow: 1; }
.explore-link { font-weight: 600; color: var(--primary-color); }
</style>