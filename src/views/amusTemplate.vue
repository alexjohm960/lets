<template>
  <div v-if="termData" class="programmatic-article">
    <h1>{{ termData.istilah }}</h1>
    <p class="short-definition">Berikut adalah penjelasan lengkap mengenai apa itu {{ termData.istilah }}.</p>
    
    <h2>Definisi {{ termData.istilah }}</h2>
    <p>{{ termData.definisi }}</p>

    <h2>Contoh Penerapan</h2>
    <p>{{ termData.contoh }}</p>

    <div class="cta-to-tool">
      <p>Butuh bantuan dengan judul yang memiliki CTR tinggi? Coba <strong>Headline Analyzer</strong> kami!</p>
      <router-link to="/" class="cta-button">Coba Sekarang</router-link>
    </div>
  </div>
  <div v-else>
    <h1>Istilah Tidak Ditemukan</h1>
    <p>Maaf, kami tidak dapat menemukan definisi untuk istilah yang Anda cari.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import glossaryData from '@/data/marketing-glossary.json'; // Impor data kita

const route = useRoute();
const slug = route.params.slug;

// Cari data yang sesuai dengan slug dari URL di dalam file JSON kita
const termData = computed(() => {
  return glossaryData.find(term => term.slug === slug);
});
</script>

<style scoped>
.programmatic-article {
  background-color: var(--card-background);
  padding: 2rem 3rem;
  border-radius: 8px;
  line-height: 1.7;
}
.short-definition {
  font-size: 1.1rem;
  color: var(--text-secondary);
}
.cta-to-tool {
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: #f0f8ff;
  border-left: 4px solid var(--primary-color);
  border-radius: 4px;
  text-align: center;
}
.cta-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 6px;
}
</style>