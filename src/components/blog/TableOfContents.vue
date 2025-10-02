<template>
  <div class="toc-wrapper" v-if="headings.length > 0">
    <div class="toc-sticky">
      <h3 class="toc-title">Table of Contents</h3>
      <nav>
        <ol>
          <li v-for="heading in headings" :key="heading.id" :class="`toc-level-${heading.level}`">
            <a :href="`#${heading.id}`">{{ heading.text }}</a>
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  articleData: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const createSlugId = (text = '') => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

const headings = computed(() => {
  if (!props.articleData || !props.articleData.term) return [];
  
  const h = [];
  const headingRegex = /^(##|###)\s+(.*)/gm;
  
  const mainContentMarkdown = `${props.articleData.deepDive || ''}\n\n${props.articleData.importance || ''}`;

  const mainMatches = [...mainContentMarkdown.matchAll(headingRegex)];
  mainMatches.forEach(match => {
    h.push({ id: createSlugId(match[2]), text: match[2].trim(), level: match[1].length });
  });

  if (props.articleData.prosCons?.length) {
    const sectionTitle = `Pros & Cons of ${props.articleData.term}`;
    h.push({ id: createSlugId(sectionTitle), text: sectionTitle, level: 2 });
    props.articleData.prosCons.forEach(item => h.push({ id: createSlugId(item.point), text: item.point, level: 3 }));
  }

  if (props.articleData.faq?.length) {
    const sectionTitle = 'Frequently Asked Questions';
    h.push({ id: createSlugId(sectionTitle), text: sectionTitle, level: 2 });
    props.articleData.faq.forEach(item => h.push({ id: createSlugId(item.question), text: item.question, level: 3 }));
  }
  return h;
});
</script>

<style scoped>
.toc-wrapper {
  position: relative;
}
.toc-sticky {
  position: sticky;
  top: 100px;
  background-color: var(--background-light);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}
.toc-title {
  margin-top: 0;
  font-size: 1.1rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
}
.toc-sticky ol {
  list-style: none;
  padding: 0;
  margin: 0;
}
.toc-sticky li {
  margin-bottom: 0.75rem;
}
.toc-sticky a {
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}
.toc-sticky a:hover {
  color: var(--primary-color);
}
.toc-level-3 {
  padding-left: 1.5rem;
}
</style> 