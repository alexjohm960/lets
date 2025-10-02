<template>
  <button class="theme-toggle" @click="toggleTheme" :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`">
    <transition name="fade" mode="out-in">
      <svg v-if="theme === 'light'" key="sun" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 7a5 5 0 1 1-4.995 5.217A5 5 0 0 1 12 7zm0 2a3 3 0 1 0 0 6a3 3 0 0 0 0-6zM5.636 5.636a1 1 0 0 1 1.414 0l1.06 1.06a1 1 0 1 1-1.414 1.414l-1.06-1.06a1 1 0 0 1 0-1.414zM1 12a1 1 0 0 1 1-1h1.5a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1zm10-9.5a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V3.5a1 1 0 0 1 1-1zm6.929 3.571a1 1 0 0 1 0 1.414l-1.06 1.06a1 1 0 1 1-1.414-1.414l1.06-1.06a1 1 0 0 1 1.414 0zM19.5 11a1 1 0 1 1 0 2h-1.5a1 1 0 1 1 0-2h1.5zm-5.515 8.485a1 1 0 0 1 1.414 0l1.06 1.06a1 1 0 0 1-1.414 1.414l-1.06-1.06a1 1 0 0 1 0-1.414zM5.5 18.071a1 1 0 0 1 1.414-1.414l1.06 1.06a1 1 0 1 1-1.414 1.414l-1.06-1.06zM12 19.5a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V20.5a1 1 0 0 1 1-1z"/></svg>
      <svg v-else key="moon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 0 0 9 9a9 9 0 0 1-9 9A9 9 0 0 1 3 12a9 9 0 0 0 9-9Z"/></svg>
    </transition>
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme.js';
const { theme, toggleTheme } = useTheme();
</script>

<style scoped>
.theme-toggle {
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
.theme-toggle:hover {
  color: var(--text-primary);
  background-color: var(--border-color);
}
.theme-toggle svg {
  width: 22px;
  height: 22px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>