<template>
  <div class="legal-page">
    <header class="page-header">
      <h1>Privacy Policy for {{ siteName }}</h1>
      <p><strong>Last Updated: {{ lastUpdated }}</strong></p>
    </header>
    
    <div class="content-wrapper">
      <p>This Privacy Policy describes Our policies and procedures on the collection, use, and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You. We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
      
      <h2>Consent</h2>
      <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

      <h2>Information We Collect</h2>
      <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
      <p>If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>
      
      <h2>Log Files</h2>
      <p>{{ siteName }} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>

      <h2>Cookies and Web Beacons</h2>
      <p>Like any other website, {{ siteName }} uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

      <h2>Google DoubleClick DART Cookie</h2>
      <p>Google is one of a third-party vendor on our site. It also uses cookies, known as Google advertising cookies, to serve ads to our site visitors based upon their visit to <a :href="siteUrl" class="external-link">{{ siteUrl }}</a> and other sites on the internet. However, visitors may choose to decline the use of these cookies by visiting the Google Ad and Content Network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="external-link">https://policies.google.com/technologies/ads</a></p>

      <h2>Our Advertising Partners</h2>
      <p>Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below.</p>
      <ul>
        <li>
          <strong>Google</strong><br>
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="external-link">https://policies.google.com/technologies/ads</a>
        </li>
      </ul>

      <h2>Third Party Privacy Policies</h2>
      <p>{{ siteName }}'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
      <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>
      <p>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" class="external-link">Google's Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" class="external-link">www.aboutads.info/choices</a>.</p>

      <h2>CCPA/GDPR Privacy Rights (Do Not Sell My Personal Information)</h2>
      <p>Under regulations like the CCPA and GDPR, among other rights, consumers have the right to request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers. You have the right to request that we erase any personal data we have collected about you, and more. If you would like to exercise any of these rights, please contact us.</p>

      <h2>Children's Information</h2>
      <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
      <p>{{ siteName }} does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
      
      <h2>Changes to This Privacy Policy</h2>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to <router-link to="/contact">contact us</router-link>.</p>
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

const pageTitle = `Privacy Policy | ${siteName}`;
// Deskripsi di-update agar lebih relevan
const pageDescription = `Official Privacy Policy for ${siteName}. Learn how we collect, use, and protect your data, and understand your rights regarding third-party advertising and cookies.`;
const pageUrl = `${siteUrl}/privacy-policy`;

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
.external-link {
  word-break: break-all;
}
</style>