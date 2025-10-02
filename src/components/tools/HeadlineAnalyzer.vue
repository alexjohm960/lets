<template>
  <div class="tool-wrapper">
    <h2>Headline Analyzer</h2>
    <p>Enter your headline to get a score and suggestions for improvement.</p>
    <div class="input-group">
      <input type="text" v-model="headlineText" placeholder="e.g., 7 Easy Ways to Learn Cooking" @keyup.enter="analyze(headlineText)" />
      <button @click="analyze(headlineText)">Analyze Headline</button>
    </div>
    <div v-if="analysis" class="results-container">
      <h3>Analysis Results:</h3>
      <div class="score-display">Overall Score: <strong>{{ analysis.score }} / 100</strong></div>
      <ul>
        <li :class="{ good: analysis.wordCountCheck.isGood, bad: !analysis.wordCountCheck.isGood }">{{ analysis.wordCountCheck.message }}</li>
        <li :class="{ good: analysis.numberCheck.isGood }">{{ analysis.numberCheck.isGood ? analysis.numberCheck.message : 'Tip: Headlines with numbers often perform better.' }}</li>
        <li :class="{ good: analysis.powerWordCheck.isGood }">{{ analysis.powerWordCheck.isGood ? analysis.powerWordCheck.message : 'Tip: Try adding a "power word" like \"secret\" or \"proven\".' }}</li>
        <li :class="{ good: analysis.emotionalWordCheck.isGood }">{{ analysis.emotionalWordCheck.isGood ? analysis.emotionalWordCheck.message : 'Tip: Try using words that trigger an emotional response.' }}</li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useHeadlineAnalysis } from '@/composables/useHeadlineAnalysis';
const headlineText = ref('');
const { analysis, analyze } = useHeadlineAnalysis();
</script>
<style scoped src="./tool-styles.css"></style>
<style scoped>
.score-display { text-align: center; font-size: 1.5rem; margin-bottom: 1.5rem; padding: 1rem; background: #f9f9f9; border-radius: 6px; }
ul { list-style: none; padding: 0; }
li { padding: 0.75rem; border-radius: 4px; margin-bottom: 0.5rem; }
li::before { content: '✔ '; margin-right: 0.5rem; }
li.good { background-color: #e8f5e9; color: #2e7d32; }
li.bad { background-color: #ffebee; color: #c62828; }
li.bad::before { content: '✖ '; }
</style>