<template>
  <header class="site-header">
    <div class="header-container">
      <router-link to="/" class="site-title" @click="closeMobileMenu">{{ siteName }}</router-link>

      <div class="nav-wrapper">
        <nav class="desktop-nav">
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/privacy-policy">Privacy Policy</router-link>
          <router-link to="/terms-of-service">Terms of Service</router-link>
          <router-link to="/disclaimer">Disclaimer</router-link>
          <router-link to="/contact">Contact</router-link>
        </nav>
        <div class="right-controls">
          <button class="icon-button search-button" @click="openSearch" aria-label="Open Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3l-1.4 1.4ZM9.5 14q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"/></svg>
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div class="mobile-controls">
        <button class="icon-button search-button" @click="openSearch" aria-label="Open Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5q0-2.725 1.888-4.612T9.5 3q2.725 0 4.612 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3l-1.4 1.4ZM9.5 14q1.875 0 3.188-1.313T14 9.5q0-1.875-1.313-3.188T9.5 5Q7.625 5 6.312 6.313T5 9.5q0 1.875 1.313 3.188T9.5 14Z"/></svg>
        </button>
        <button class="mobile-nav-toggle" @click="toggleMobileMenu" aria-label="Toggle Navigation">
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"/></svg>
        </button>
      </div>

      <nav class="mobile-nav" :class="{ 'is-open': isMobileMenuOpen }">
        <router-link to="/" @click="closeMobileMenu">Home</router-link>
        <router-link to="/about" @click="closeMobileMenu">About</router-link>
        <router-link to="/privacy-policy" @click="closeMobileMenu">Privacy Policy</router-link>
        <router-link to="/terms-of-service" @click="closeMobileMenu">Terms of Service</router-link>
        <router-link to="/disclaimer" @click="closeMobileMenu">Disclaimer</router-link>
        <router-link to="/contact" @click="closeMobileMenu">Contact</router-link>
        <div class="mobile-theme-toggle">
          <ThemeToggle />
        </div>
      </nav>
      
      <div v-if="isMobileMenuOpen" class="overlay" @click="closeMobileMenu"></div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';
import { useSearch } from '@/composables/useSearch';

const { openSearch } = useSearch();
const siteName = import.meta.env.VITE_SITE_NAME || 'KontenKit';
const isMobileMenuOpen = ref(false);
const route = useRoute();

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
});

watch(() => route.path, () => {
  closeMobileMenu();
});
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  transition: box-shadow 0.2s ease, background-color 0.3s ease;
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}
@media (min-width: 768px) {
  .header-container {
    padding: 0 var(--spacing-lg);
  }
}
.site-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  z-index: 1001;
}
.nav-wrapper, .mobile-controls {
  display: none;
}
.mobile-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: background-color 0.2s ease, color 0.2s ease;
}
.icon-button:hover {
  color: var(--text-primary);
  background-color: var(--border-color);
}
.icon-button svg {
  width: 22px;
  height: 22px;
}
.mobile-nav-toggle {
  padding: 0;
  z-index: 1001;
}
.mobile-nav {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  background-color: var(--card-background);
  box-shadow: -5px 0 15px var(--shadow-color);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out, background-color 0.3s ease;
  z-index: 1000;
  padding: 6rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.mobile-nav.is-open {
  transform: translateX(0);
}
.mobile-nav a {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 0.75rem 0;
  transition: color 0.2s ease;
}
.mobile-nav a:hover,
.mobile-nav a.router-link-exact-active {
  color: var(--primary-color);
}
.mobile-theme-toggle {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
}
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
@media (min-width: 768px) {
  .nav-wrapper {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .right-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .desktop-nav {
    display: flex;
    gap: 2rem;
  }
  .desktop-nav a {
    text-decoration: none;
    color: var(--text-secondary);
    font-weight: 600;
    font-size: 1rem;
    transition: color 0.2s ease;
  }
  .desktop-nav a:hover {
    color: var(--text-primary);
    text-decoration: none;
  }
  .desktop-nav a.router-link-exact-active {
    color: var(--primary-color);
  }
  .mobile-controls, .mobile-nav, .overlay {
    display: none;
  }
}
</style>

<style>
body.no-scroll {
  overflow: hidden;
}
</style>