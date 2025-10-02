<template>
  <div v-if="isVisible" id="floating-ad-container" class="floating-ad-wrapper">
    <button @click="closeAd" class="close-button">X</button>
    <div ref="adContentContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { adSlots } from '@/adConfig.js';

const isVisible = ref(false);
const adContentContainer = ref(null);

const closeAd = () => {
  isVisible.value = false;
};

const showAd = async () => {
  try {
    const response = await fetch('/ads-content/floating.html');
    if (!response.ok) return;
    const adCode = await response.text();

    if (!adCode || adCode.trim() === '') return;

    isVisible.value = true;
    
    await nextTick();

    if (adContentContainer.value) {
      adContentContainer.value.innerHTML = adCode;
      const scriptElements = adContentContainer.value.querySelectorAll('script');
      scriptElements.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        oldScript.parentNode.replaceChild(newScript, oldScript);
      });
    }
  } catch (error) {}
};

onMounted(() => {
  if (!import.meta.env.SSR && adSlots.floating.enabled) {
    // Tunda untuk memastikan hidrasi selesai
    setTimeout(() => {
      showAd();
    }, 2500); 
  }
});
</script>

<style scoped>
.floating-ad-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background-color: white;
  padding: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #eee;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
  padding: 0;
}
</style>