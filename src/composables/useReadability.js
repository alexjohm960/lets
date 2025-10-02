import { reactive } from 'vue';

export function useReadability() {
  const results = reactive({ score: 0, wordCount: 0, sentenceCount: 0, interpretation: '', isCalculated: false });

  function countSyllables(word) {
      word = word.toLowerCase();
      if(word.length <= 3) return 1;
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
      word = word.replace(/^y/, '');
      const matches = word.match(/[aeiouy]{1,2}/g);
      return matches ? matches.length : 0;
  }

  function calculate(text) {
    if (!text || text.trim() === '') {
        results.isCalculated = false;
        return;
    }
    const words = text.match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    results.wordCount = words.length;
    results.sentenceCount = sentences.length;
    if (results.wordCount === 0 || results.sentenceCount === 0) {
        results.isCalculated = false;
        return;
    };
    
    const syllableCount = words.reduce((acc, word) => acc + countSyllables(word), 0);
    const scoreValue = 206.835 - 1.015 * (results.wordCount / results.sentenceCount) - 84.6 * (syllableCount / results.wordCount);
    results.score = parseFloat(scoreValue.toFixed(2));

    if (scoreValue >= 90) results.interpretation = "Very Easy to Read.";
    else if (scoreValue >= 70) results.interpretation = "Fairly Easy to Read.";
    else if (scoreValue >= 50) results.interpretation = "A bit difficult to read.";
    else if (scoreValue >= 30) results.interpretation = "Difficult to read.";
    else results.interpretation = "Very Difficult to read.";
    
    results.isCalculated = true;
  }
  return { results, calculate };
}