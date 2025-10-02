<template>
  <div class="about-page">
    <header class="page-header">
      <h1>Our Mission: Empowering Creators</h1>
      <p class="subtitle">We believe that great content deserves to be seen. Our goal is to provide simple, powerful, and free tools to help you succeed.</p>
    </header>

    <div class="content-wrapper">
      <section class="about-section">
        <h2>What is {{ siteName }}?</h2>
        <p>
          {{ siteName }} was born from a simple observation: content creation is hard. Coming up with viral ideas, writing engaging text, and optimizing for search engines can be overwhelming. We saw a need for a straightforward, no-nonsense toolkit designed specifically for the modern content creator, blogger, and marketer.
        </p>
        <p>
          This platform is our answer. It's a curated collection of free tools and high-quality educational content, designed to streamline your workflow and amplify the impact of your writing.
        </p>
      </section>

      <section class="about-section">
        <h2>Our Philosophy</h2>
        <p>
          We operate on a few core principles:
        </p>
        <ul>
          <li><strong>Simplicity Over Clutter:</strong> Our tools do one thing, and they do it well. No complex dashboards, no confusing settings.</li>
          <li><strong>Data-Driven, Not Guesswork:</strong> The insights provided by our tools are based on proven principles of readability, SEO, and marketing psychology.</li>
          <li><strong>Free and Accessible to All:</strong> We believe that everyone should have access to the tools they need to grow. Our core toolkit will always be free.</li>
        </ul>
      </section>

      <section class="about-section">
        <h2>Who We Are</h2>
        <p>
          We are a small team of developers, writers, and digital marketing enthusiasts who are passionate about building useful things for the internet. We use our own tools every day to improve our own content, and we're constantly working to make them better based on real-world feedback.
        </p>
      </section>
      
      <section class="cta-section">
        <h2>Join Us on Our Journey</h2>
        <p>
          {{ siteName }} is always evolving. If you have feedback, an idea for a new tool, or just want to say hello, we'd love to hear from you.
        </p>
        <router-link to="/contact" class="cta-button">Get in Touch</router-link>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue';

const siteName = import.meta.env.VITE_SITE_NAME || 'KontenKit';
const siteUrl = import.meta.env.VITE_SITE_URL || 'https://www.kontenkit.com';

const pageTitle = `About Us | ${siteName}`;
const pageDescription = `Learn about the mission and philosophy behind ${siteName}, a free toolkit designed to help content creators, bloggers, and marketers succeed.`;
const pageUrl = `${siteUrl}/about`;

useHead({
  title: pageTitle,
  link: [
    { rel: 'canonical', href: pageUrl }
  ],
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:url', content: pageUrl },
    { property: 'og:image', content: `${siteUrl}/logo.png` },
  ],
});
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
}
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}
.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
}
.subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}
.content-wrapper {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}
@media (min-width: 768px) {
  .content-wrapper {
    padding: 3rem;
  }
}
.about-section {
  margin-bottom: 2.5rem;
}
.about-section h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}
.about-section ul {
  list-style: '✔ ';
  padding-left: 1.5rem;
}
.about-section li {
  margin-bottom: 0.75rem;
}
.cta-section {
  margin-top: 3rem;
  text-align: center;
  background-color: var(--background-light);
  padding: 2rem;
  border-radius: var(--border-radius);
}
.cta-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 12px 24px;
  background-color: var(--primary-color);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  border-radius: 6px;
  transition: opacity 0.2s ease;
}
.cta-button:hover {
  opacity: 0.85;
  text-decoration: none;
}
</style>