<template>
  <div v-if="htmlContent" v-html="htmlContent" ref="adContainer" class="ad-renderer-wrapper"></div>
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
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    if (oldScript.innerHTML) {
      newScript.innerHTML = oldScript.innerHTML;
    }
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
};

onMounted(async () => {
  if (import.meta.env.SSR) return;

  try {
    const response = await fetch(`/ads-content/${props.slotName}.html`);
    if (!response.ok) {
      return;
    }
    const rawContent = await response.text();

    if (rawContent && rawContent.trim() !== '') {
      htmlContent.value = rawContent;
      await nextTick();
      executeScriptsInContainer(adContainer.value);
    }
  } catch (error) {
  }
});
</script>

<style scoped>
.ad-renderer-wrapper {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0;
}
</style>