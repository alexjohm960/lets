import { ref } from 'vue';

export function useHeadlineAnalysis() {
  const analysis = ref(null);

  const powerWords = ["secret", "powerful", "proven", "shocking", "easy", "fast", "guaranteed", "ultimate", "best", "effective", "amazing"];
  const emotionalWords = ["happy", "success", "dream", "fear", "mistake", "painful", "love", "hope", "win", "lose"];

  function analyze(headline) {
    if (!headline || headline.trim() === '') {
        analysis.value = null;
        return;
    }
    const words = headline.match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    let score = 0;

    const wordCountCheck = { isGood: wordCount >= 6 && wordCount <= 12, message: `Word count is ${wordCount}. (Ideal: 6-12)` };
    if (wordCountCheck.isGood) score += 25;

    const numberCheck = { isGood: /\d/.test(headline), message: "Includes a number, which increases clicks." };
    if (numberCheck.isGood) score += 25;

    const foundPowerWords = words.filter(word => powerWords.includes(word.toLowerCase()));
    const powerWordCheck = { isGood: foundPowerWords.length > 0, message: `Contains power words: ${foundPowerWords.join(', ')}` };
    if (powerWordCheck.isGood) score += 25;

    const foundEmotionalWords = words.filter(word => emotionalWords.includes(word.toLowerCase()));
    const emotionalWordCheck = { isGood: foundEmotionalWords.length > 0, message: `Triggers emotion with: ${foundEmotionalWords.join(', ')}` };
    if (emotionalWordCheck.isGood) score += 25;

    analysis.value = { score, wordCountCheck, numberCheck, powerWordCheck, emotionalWordCheck };
  }
  return { analysis, analyze };
}