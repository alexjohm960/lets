<!-- src/views/GlossaryTemplate.vue (Contoh yang disederhanakan) -->
<template>
  <div v-if="data" class="programmatic-article">
    <h1>{{ data.term }}</h1>
    <p class="summary"><em>{{ data.summary }}</em></p>
    
    <article>
      <h2>A Deep Dive into {{ data.term }}</h2>
      <p>{{ data.deepDive }}</p> <!-- Ratusan kata di sini -->

      <h2>Why is {{ data.term }} Important?</h2>
      <p>{{ data.importance }}</p> <!-- Ratusan kata lagi -->

      <!-- Menampilkan Pro & Kontra -->
      <div v-if="data.prosCons && data.prosCons.length">
        <h2>Pros & Cons</h2>
        <div v-for="item in data.prosCons" :key="item.point">
          <h3>{{ item.point }}</h3>
          <p>{{ item.explanation }}</p>
        </div>
      </div>

      <!-- Menampilkan FAQ -->
      <div v-if="data.faq && data.faq.length" class="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div v-for="item in data.faq" :key="item.question">
          <h3>{{ item.question }}</h3>
          <p>{{ item.answer }}</p>
        </div>
      </div>

      <!-- Menampilkan Istilah Terkait (Internal Linking!) -->
      <div v-if="data.relatedTerms && data.relatedTerms.length" class="related-section">
        <h2>Related Terms</h2>
        <ul>
          <li v-for="term in data.relatedTerms" :key="term.slug">
            <router-link :to="`/glossary/${term.slug}`">{{ term.term }}</router-link>
          </li>
        </ul>
      </div>
    </article>
  </div>
</template>

<script setup>
defineProps({ data: Object });
</script>