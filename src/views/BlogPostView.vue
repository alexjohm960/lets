<template>
  <div class="post-wrapper">
    <!-- Komponen 'component' akan me-render file .md yang sudah ditemukan -->
    <component v-if="postComponent" :is="postComponent" class="markdown-body" />
    <div v-else>
      <h1>Post Not Found</h1>
      <p>Sorry, we couldn't find the article you were looking for.</p>
    </div>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';

// 1. Dapatkan slug dari URL saat ini
const route = useRoute();
let slug = route.params.slug;

// 2. Buat referensi untuk menyimpan komponen Markdown yang sudah dimuat
const postComponent = shallowRef(null);

// 3. Gunakan import.meta.glob untuk mendapatkan daftar SEMUA kemungkinan postingan
const posts = import.meta.glob('../posts/*.md');

// 4. Buat fungsi untuk memuat komponen yang benar berdasarkan slug
const loadPost = async (currentSlug) => {
  // Bangun path file yang diharapkan
  const path = `../posts/${currentSlug}.md`;
  
  // Periksa apakah path tersebut ada di dalam daftar yang ditemukan oleh glob
  if (posts[path]) {
    // Jika ada, muat modulnya
    const module = await posts[path]();
    // Komponen Vue itu sendiri adalah 'default' export dari modul
    postComponent.value = module.default;
  } else {
    // Jika tidak ditemukan, set komponen menjadi null
    postComponent.value = null;
    console.error(`Post with slug "${currentSlug}" not found.`);
  }
};

// 5. Panggil fungsi untuk memuat postingan saat komponen pertama kali dibuat
loadPost(slug);

// (Opsional tapi praktik yang baik) Jika Anda memiliki link antar postingan di dalam
// halaman postingan itu sendiri, ini akan memastikan komponen diperbarui
onBeforeRouteUpdate(async (to, from) => {
  if (to.params.slug !== from.params.slug) {
    await loadPost(to.params.slug);
  }
});
</script>

<style>
/* Gaya ini bisa tetap sama atau dipindahkan ke file CSS global jika Anda mau */
.markdown-body {
  background-color: var(--card-background);
  padding: 2rem 3rem;
  border-radius: 8px;
  line-height: 1.7;
}
.markdown-body h1, .markdown-body h2, .markdown-body h3 {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}
</style>