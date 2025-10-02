<template>
  <div class="home-container">
    <header class="home-header">
      <h1>Content Creator's Toolkit</h1>
      <p class="subtitle">A set of free tools to enhance your writing and content strategy.</p>
    </header>

    <!-- Placeholder Iklan untuk Halaman Utama -->
    <AdPlaceholderHomepage />

    <div class="tool-tabs">
      <button
        v-for="tool in tools"
        :key="tool.id"
        :class="{ active: activeTool === tool.id }"
        @click="activeTool = tool.id"
      >
        {{ tool.name }}
      </button>
    </div>

    <div class="tool-content">
      <keep-alive>
        <component :is="activeToolComponent" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HeadlineGenerator from '@/components/tools/HeadlineGenerator.vue';
import ReadabilityChecker from '@/components/tools/ReadabilityChecker.vue';
import HeadlineAnalyzer from '@/components/tools/HeadlineAnalyzer.vue';
import AdPlaceholderHomepage from '@/components/ads/AdPlaceholderHomepage.vue';

const activeTool = ref('generator');

const tools = [
  { id: 'generator', name: 'Headline Generator', component: HeadlineGenerator },
  { id: 'readability', name: 'Readability Checker', component: ReadabilityChecker },
  { id: 'analyzer', name: 'Headline Analyzer', component: HeadlineAnalyzer },
];

const activeToolComponent = computed(() => {
  const currentTool = tools.find(tool => tool.id === activeTool.value);
  return currentTool.component;
});
</script>

<style scoped>
.home-header {
  text-align: center;
  margin-bottom: 1rem;
}

.home-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 500px;
  margin: 0 auto;
}

.tool-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: var(--spacing-lg);
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.tool-tabs button {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border: none;
  background-color: transparent;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 3px solid transparent;
  transform: translateY(1px);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tool-tabs button:hover {
  color: var(--text-primary);
}

.tool-tabs button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tool-content {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  box-shadow: 0 8px 30px var(--shadow-color);
  border: 1px solid var(--border-color);
}

@media (min-width: 768px) {
  .home-header h1 {
    font-size: 2.5rem;
  }

  .tool-tabs button {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  .tool-content {
    padding: 2.5rem;
  }
}
</style>