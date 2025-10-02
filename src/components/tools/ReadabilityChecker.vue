<template>
  <div class="tool-wrapper">
    <h2>Readability Checker</h2>
    <p>Paste your text below to analyze its reading level based on the Flesch-Kincaid formula.</p>
    <textarea v-model="inputText" placeholder="Paste your text here..."></textarea>
    <button @click="calculate(inputText)">Analyze Text</button>
    <div v-if="results.isCalculated" class="results-container">
      <h3>Readability Analysis:</h3>
      <div class="stats-grid">
        <div class="stat-item"><h4>Score</h4><p>{{ results.score }}</p></div>
        <div class="stat-item"><h4>Word Count</h4><p>{{ results.wordCount }}</p></div>
        <div class="stat-item"><h4>Sentence Count</h4><p>{{ results.sentenceCount }}</p></div>
      </div>
      <div class="interpretation"><strong>Interpretation:</strong> {{ results.interpretation }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useReadability } from '@/composables/useReadability';
const inputText = ref('');
const { results, calculate } = useReadability();
</script>
<style scoped src="./tool-styles.css"></style>
<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center; margin-bottom: 1.5rem; }
.stat-item { background: #f9f9f9; padding: 1rem; border-radius: 6px; }
.stat-item h4 { margin: 0 0 0.5rem 0; color: #555; }
.stat-item p { font-size: 1.5rem; font-weight: bold; color: #3498db; margin: 0; }
.interpretation { background-color: #eaf5fc; border-left: 4px solid #3498db; padding: 1rem; }
</style>