<template>
  <div class="tool-wrapper">
    <h2>Headline Idea Generator</h2>
    <p>Enter a keyword to get a list of catchy headline ideas for your blog or article.</p>
    <div class="input-group">
      <input type="text" v-model="topic" placeholder="e.g., Healthy Diet" @keyup.enter="generate" />
      <button @click="generate">Generate Ideas</button>
    </div>
    <div v-if="headlines.length > 0" class="results-container">
      <h3>Here are some ideas for "{{ originalTopic }}":</h3>
      <ul><li v-for="(headline, index) in headlines" :key="index">{{ headline }}</li></ul>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const topic = ref('');
const originalTopic = ref('');
const headlines = ref([]);
function generate() {
  if (!topic.value.trim()) return;
  originalTopic.value = topic.value;
  headlines.value = [
    `The Ultimate Guide to ${topic.value}`,
    `7 Surprising Ways to Master ${topic.value}`,
    `Why Everyone Is Talking About ${topic.value}`,
    `Common Mistakes Beginners Make in ${topic.value}`,
    `The Secret to Successful ${topic.value}`
  ];
}
</script>
<style scoped src="./tool-styles.css"></style>