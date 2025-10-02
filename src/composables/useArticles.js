import { ref, onServerPrefetch } from 'vue';
import fs from 'fs';
import path from 'path';

const articles = ref([]);
const isLoaded = ref(false);

export function useArticles() {
  const isLoading = ref(false);

  const fetchArticles = async () => {
    if (isLoaded.value) {
      return;
    }

    isLoading.value = true;
    try {
      if (import.meta.env.SSR) {
        const articlesJsonPath = path.resolve(process.cwd(), 'public/articles.json');
        const fileContent = fs.readFileSync(articlesJsonPath, 'utf-8');
        articles.value = JSON.parse(fileContent);
      } else {
        const response = await fetch('/articles.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        articles.value = await response.json();
      }
      isLoaded.value = true;
    } catch (error) {
      console.error('Failed to load articles:', error);
      articles.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  onServerPrefetch(async () => {
    await fetchArticles();
  });

  return {
    articles,
    isLoading,
    isLoaded,
    fetchArticles,
  };
}