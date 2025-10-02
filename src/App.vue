<template>
  <div id="app-container">
    <Navbar />
    <AdRenderer v-if="adSlots.underNav.enabled" slotName="under-nav" />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <SearchModal />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Navbar from '@/components/layout/Navbar.vue';
import Footer from '@/components/layout/Footer.vue'; 
import SearchModal from '@/components/search/SearchModal.vue';
import AdRenderer from '@/components/ads/AdRenderer.vue';
import { useSearch } from '@/composables/useSearch';
import { adSlots } from '@/adConfig.js';
import { useTheme } from '@/composables/useTheme.js';

useSearch();
useTheme();

const showFloatingAd = async () => {
  try {
    const response = await fetch('/ads-content/floating.html');
    if (!response.ok) return;
    const adCode = await response.text();

    if (!adCode || adCode.trim() === '') {
      return;
    }

    const adContainer = document.createElement('div');
    adContainer.id = 'floating-ad-container';
    adContainer.style.position = 'fixed';
    adContainer.style.top = '50%';
    adContainer.style.left = '50%';
    adContainer.style.transform = 'translate(-50%, -50%)';
    adContainer.style.zIndex = '9999';
    adContainer.style.backgroundColor = 'white';
    adContainer.style.padding = '10px';
    adContainer.style.border = '1px solid #ccc';
    adContainer.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';

    adContainer.innerHTML = adCode;

    const scriptElements = adContainer.querySelectorAll('script');
    scriptElements.forEach(oldScript => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML;
      }
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
    
    document.body.appendChild(adContainer);

    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.background = '#eee';
    closeButton.style.border = '1px solid #ddd';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '25px';
    closeButton.style.height = '25px';
    closeButton.style.lineHeight = '25px';
    closeButton.style.textAlign = 'center';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.padding = '0';
    
    closeButton.onclick = () => {
      adContainer.remove();
    };

    adContainer.prepend(closeButton);

  } catch (error) {
    console.warn('Could not load floating ad content.');
  }
};

onMounted(() => {
  if (!import.meta.env.SSR && adSlots.floating.enabled) {
    if (document.readyState === 'complete') {
      showFloatingAd();
    } else {
      window.addEventListener('load', showFloatingAd, { once: true });
    }
  }
});
</script>

<style scoped>
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content { 
  padding-top: 70px;  
  flex-grow: 1; 
}
</style>