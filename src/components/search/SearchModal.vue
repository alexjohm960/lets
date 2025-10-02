<template>
  <transition name="fade">
    <div v-if="isSearchOpen" class="search-modal-overlay" @click="closeSearch">
      <div class="search-modal-content" @click.stop>
        
        <div class="search-input-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3l-1.4 1.4ZM9.5 14q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"/></svg>
          <input 
            type="text" 
            placeholder="Search articles..."
            v-model="searchTerm"
            @input="performSearch"
            ref="searchInput"
          >
          <button class="close-button" @click="closeSearch" aria-label="Close Search">Esc</button>
        </div>

        <div class="search-results-wrapper">
          <div v-if="isLoading" class="state-message">Loading articles database...</div>
          <div v-else-if="searchResults.length > 0">
            <ul class="results-list">
              <li v-for="post in searchResults" :key="post.slug">
                <router-link :to="`/${post.slug}`" @click="closeSearch">
                  <span class="result-title">{{ post.term }}</span>
                  <span class="result-summary">{{ post.summary }}</span>
                </router-link>
              </li>
            </ul>
          </div>
          <div v-else-if="searchTerm.length >= 2 && !isLoading" class="state-message">
            No results found for "{{ searchTerm }}".
          </div>
          <div v-else class="state-message">
            Start typing to find articles.
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';
import { useSearch } from '@/composables/useSearch';

const { isSearchOpen, searchTerm, isLoading, searchResults, performSearch, closeSearch } = useSearch();
const searchInput = ref(null);

watch(isSearchOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('no-scroll');
    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
  } else {
    document.body.classList.remove('no-scroll');
  }
});

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isSearchOpen.value) {
    closeSearch();
  }
};

window.addEventListener('keydown', handleKeydown);

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.search-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  display: flex;
  justify-content: center;
  padding-top: 10vh;
}
.search-modal-content {
  width: 90%;
  max-width: 600px;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px var(--shadow-color);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: min-content;
  max-height: 80vh;
}
.search-input-wrapper {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border-color);
}
.search-icon {
  color: var(--text-secondary);
  margin-right: 0.75rem;
}
input[type="text"] {
  width: 100%;
  border: none;
  background: none;
  font-size: 1.2rem;
  padding: 0.75rem 0;
  color: var(--text-primary);
}
input[type="text"]:focus {
  outline: none;
}
.close-button {
  background: var(--background-light);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
}
.search-results-wrapper {
  overflow-y: auto;
  padding: 1rem;
}
.state-message {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}
.results-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.results-list li a {
  display: block;
  padding: 1rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  transition: background-color 0.2s ease;
}
.results-list li a:hover {
  background-color: var(--background-light);
  text-decoration: none;
}
.result-title {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}
.result-summary {
  display: block;
  font-size: 0.9rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>