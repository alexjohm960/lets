<template>
  <div class="legal-page">
    <header class="page-header">
      <h1>Disclaimer</h1>
      <p><strong>Last Updated: {{ lastUpdated }}</strong></p>
    </header>
    
    <div class="content-wrapper">
      <p>The information provided by {{ siteName }} ("we," "us," or "our") on <a :href="siteUrl">{{ siteUrl }}</a> (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>
      
      <h2>AI-Generated Content Disclaimer</h2>
      <p>A significant portion of the content on this site, including but not limited to articles, summaries, and analyses, is generated with the assistance of artificial intelligence (AI) technologies. While we strive to guide the AI to produce accurate and helpful information, the content is created based on patterns in data and may not always be up-to-date, complete, or free from error. We review the generated content, but we cannot guarantee its absolute accuracy. All AI-generated content should be viewed as a starting point for information, not as a definitive source.</p>
      
      <h2>Professional Disclaimer</h2>
      <p>The Site cannot and does not contain professional advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. For example, if articles discuss financial or health-related topics, they are not intended as financial or medical advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of professional advice. THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THIS SITE IS SOLELY AT YOUR OWN RISK.</p>

      <h2>External Links Disclaimer</h2>
      <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE.</p>
      
      <h2>Affiliates Disclaimer</h2>
      <p>The Site may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links. Our affiliates may include but are not limited to partners such as Amazon Associates, Commission Junction, and others.</p>

      <h2>Errors and Omissions Disclaimer</h2>
      <p>While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, {{ siteName }} is not responsible for any errors or omissions or for the results obtained from the use of this information.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useHead } from '@unhead/vue';

const siteName = import.meta.env.VITE_SITE_NAME;
const siteUrl = import.meta.env.VITE_SITE_URL;

const lastUpdated = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});

const pageTitle = `Disclaimer | ${siteName}`;
const pageDescription = `Disclaimer for ${siteName}. Information regarding AI-generated content, external links, affiliates, and professional advice.`;
const pageUrl = `${siteUrl}/disclaimer`;

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
.legal-page {
  max-width: 800px;
  margin: 0 auto;
}
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 2.5rem;
}
.content-wrapper {
  background-color: var(--card-background);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  line-height: var(--line-height-base);
}
@media (min-width: 768px) {
  .content-wrapper {
    padding: 3rem;
  }
}
.content-wrapper h2 {
  font-size: 1.75rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}
.content-wrapper p {
  margin-bottom: 1rem;
}
</style>