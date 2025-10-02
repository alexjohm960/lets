<template>
  <footer class="site-footer">
    <div class="footer-links">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/privacy-policy">Privacy Policy</router-link>
      <router-link to="/terms-of-service">Terms of Service</router-link>
      <router-link to="/disclaimer">Disclaimer</router-link>
    </div>
    <p>&copy; {{ new Date().getFullYear() }} {{ siteName }}. All rights reserved.</p>
  </footer>
</template>

<script setup>
const siteName = import.meta.env.VITE_SITE_NAME || 'KontenKit';
</script>

<style scoped>
.site-footer {
  text-align: center;
  margin-top: 4rem;
  padding: 2rem 0;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-links {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--primary-color);
}
</style>