<template>
  <div class="legal-page">
    <header class="page-header">
      <h1>Terms of Service</h1>
      <p><strong>Last Updated: {{ lastUpdated }}</strong></p>
    </header>
    
    <div class="content-wrapper">
      <p>Welcome to {{ siteName }}! These terms and conditions outline the rules and regulations for the use of {{ siteName }}'s Website, located at <a :href="siteUrl">{{ siteUrl }}</a>.</p>
      <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use {{ siteName }} if you do not agree to take all of the terms and conditions stated on this page.</p>

      <h2>1. Intellectual Property Rights</h2>
      <p>Other than the content you own, under these Terms, {{ siteName }} and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this Website.</p>

      <h2>2. Restrictions</h2>
      <p>You are specifically restricted from all of the following:</p>
      <ul>
        <li>publishing any Website material in any other media;</li>
        <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
        <li>publicly performing and/or showing any Website material;</li>
        <li>using this Website in any way that is or may be damaging to this Website;</li>
        <li>using this Website in any way that impacts user access to this Website;</li>
        <li>using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</li>
        <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</li>
        <li>using this Website to engage in any advertising or marketing.</li>
      </ul>

      <h2>3. User Content</h2>
      <p>In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant {{ siteName }} a non-exclusive, worldwide irrevocable, sub-licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>
      <p>Your Content must be your own and must not be invading any third-party's rights. {{ siteName }} reserves the right to remove any of Your Content from this Website at any time without notice.</p>

      <h2>4. Links to Other Websites</h2>
      <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by {{ siteName }}. {{ siteName }} has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that {{ siteName }} shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>

      <h2>5. No warranties</h2>
      <p>This Website is provided "as is," with all faults, and {{ siteName }} express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>
      
      <h2>6. Limitation of Liability</h2>
      <p>In no event shall {{ siteName }}, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. {{ siteName }}, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
      
      <h2>7. Changes to These Terms</h2>
      <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
      
      <h2>8. Governing Law</h2>
      <p>These Terms will be governed by and interpreted in accordance with the laws of the jurisdiction in which the owner is based, and you submit to the non-exclusive jurisdiction of the state and federal courts located in that jurisdiction for the resolution of any disputes.</p>
      
      <h2>9. Contact Us</h2>
      <p>If you have any questions about these Terms, please <router-link to="/contact">contact us</router-link>.</p>
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

const pageTitle = `Terms of Service | ${siteName}`;
const pageDescription = `Read the Terms of Service for ${siteName}. Understand the rules and guidelines for using our website and services.`;
const pageUrl = `${siteUrl}/terms-of-service`;

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
.content-wrapper p, .content-wrapper ul {
  margin-bottom: 1rem;
}
.content-wrapper ul {
  padding-left: 2rem;
}
.content-wrapper li {
  margin-bottom: 0.5rem;
}
</style>