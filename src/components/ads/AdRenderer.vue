<template>
  <div v-if="htmlContent" v-html="htmlContent" ref="adContainer" class="ad-renderer-wrapper"></div>
  <div v-else class="ad-placeholder">
    <span>Loading advertisement...</span>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const props = defineProps({
  slotName: {
    type: String,
    required: true,
  },
});

const htmlContent = ref('');
const adContainer = ref(null);

const executeScriptsInContainer = (container) => {
  if (!container) return;
  
  const scriptElements = container.querySelectorAll('script');
  
  scriptElements.forEach(oldScript => {
    const newScript = document.createElement('script');
    
    // Copy semua attributes
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    
    // Copy inner content
    if (oldScript.innerHTML) {
      newScript.innerHTML = oldScript.innerHTML;
    }
    
    // Replace script lama dengan yang baru
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
  
  // Pastikan AdSense di-load ulang setelah script diganti
  if (window.adsbygoogle) {
    setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        console.log(`AdSense pushed for slot: ${props.slotName}`);
      } catch (error) {
        console.error('Error pushing AdSense:', error);
      }
    }, 300);
  }
};

const loadAdContent = async () => {
  if (import.meta.env.SSR) return;

  try {
    console.log(`Loading ad content for: ${props.slotName}`);
    
    const response = await fetch(`/ads-content/${props.slotName}.html`);
    
    if (!response.ok) {
      console.warn(`Ad content not found for: ${props.slotName}`);
      return;
    }
    
    const rawContent = await response.text();
    console.log(`Raw content loaded for ${props.slotName}`, rawContent.substring(0, 200));

    if (rawContent && rawContent.trim() !== '') {
      htmlContent.value = rawContent;
      
      // Tunggu DOM update
      await nextTick();
      
      // Eksekusi scripts
      if (adContainer.value) {
        executeScriptsInContainer(adContainer.value);
      }
      
      // Fallback: coba push AdSense lagi setelah beberapa waktu
      setTimeout(() => {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }, 1000);
    }
  } catch (error) {
    console.error(`Error loading ad ${props.slotName}:`, error);
  }
};

onMounted(() => {
  // Delay sedikit untuk memastikan DOM sudah siap
  setTimeout(() => {
    loadAdContent();
  }, 500);
});
</script>

<style scoped>
.ad-renderer-wrapper {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0;
  min-height: 90px;
  width: 100%;
}

.ad-placeholder {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90px;
  background-color: #f5f5f5;
  border: 1px dashed #ddd;
  color: #999;
  font-size: 14px;
}

.ad-renderer-wrapper :deep(ins.adsbygoogle) {
  display: block !important;
  margin: 0 auto;
}

.ad-renderer-wrapper :deep(script) {
  display: none !important;
}
</style>
