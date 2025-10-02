<template>
  <div class="social-share">
    <h4>Share this Article:</h4>
    <div class="share-buttons">
      <a :href="twitterUrl" target="_blank" rel="noopener noreferrer" class="share-button twitter">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.34 0 11.35-6.08 11.35-11.35 0-.17 0-.34-.01-.51.78-.57 1.45-1.28 1.99-2.08z"/></svg>
        <span>Twitter</span>
      </a>
      <a :href="linkedinUrl" target="_blank" rel="noopener noreferrer" class="share-button linkedin">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-1.12-1.68-1.68-1.68a1.69 1.69 0 0 0-1.69 1.68c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"/></svg>
        <span>LinkedIn</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  }
});

const currentUrl = computed(() => window.location.href);

const twitterUrl = computed(() => {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl.value)}&text=${encodeURIComponent(props.title)}`;
});

const linkedinUrl = computed(() => {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl.value)}`;
});
</script>

<style scoped>
.social-share {
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: var(--background-light);
  border-radius: 8px;
  text-align: center;
}
.social-share h4 {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  font-weight: 500;
}
.share-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.share-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  text-decoration: none;
  color: #fff;
  font-weight: 600;
  transition: opacity 0.2s ease;
}
.share-button:hover {
  opacity: 0.85;
}
.share-button svg {
  margin-bottom: -2px;
}
.twitter { background-color: #1DA1F2; }
.linkedin { background-color: #0077B5; }
</style>