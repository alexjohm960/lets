<template>
  <div ref="adContainer" class="ad-slot-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
});

const adContainer = ref(null);

const executeCode = () => {
  if (adContainer.value) {
    adContainer.value.innerHTML = props.code;
    
    const scriptElements = adContainer.value.querySelectorAll('script');
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
  }
};

onMounted(() => {
  nextTick(() => {
    executeCode();
  });
});

onUnmounted(() => {
  if (adContainer.value) {
    adContainer.value.innerHTML = '';
  }
});
</script>

<style scoped>
.ad-slot-container {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>