import { ref, computed } from 'vue';

const isSearchOpen = ref(false);
const searchTerm = ref('');
const allArticles = ref([]);
const isLoading = ref(true);
let debounceTimer = null;

async function loadArticles() {
  if (allArticles.value.length > 0) {
    isLoading.value = false;
    return;
  }
  
  try {
    const response = await fetch('/articles.json');
    const data = await response.json();
    allArticles.value = data;
  } catch (error) {
    console.error('Failed to load articles for search:', error);
    allArticles.value = [];
  } finally {
    isLoading.value = false;
  }
}

const searchResults = computed(() => {
  if (searchTerm.value.length < 2) {
    return [];
  }
  const lowerCaseTerm = searchTerm.value.toLowerCase();
  return allArticles.value.filter(article => 
    article.term.toLowerCase().includes(lowerCaseTerm) || 
    article.summary.toLowerCase().includes(lowerCaseTerm)
  );
});

export function useSearch() {
  function openSearch() {
    isSearchOpen.value = true;
    searchTerm.value = '';
    loadArticles();
  }

  function closeSearch() {
    isSearchOpen.value = false;
  }
  
  function performSearch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Fungsi ini sengaja dibiarkan kosong untuk saat ini.
      // Logika pencarian utama ditangani oleh 'computed property' 'searchResults'.
      // Debouncing di sini hanya untuk mencegah pembebanan berlebih di masa depan jika diperlukan.
    }, 300);
  }

  return {
    isSearchOpen,
    searchTerm,
    isLoading,
    searchResults,
    openSearch,
    closeSearch,
    performSearch
  };
}