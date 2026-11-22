export function analyzeReadability(text) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean);
  const sentences = (text || "").split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = sentences.length ? +(words.length / sentences.length).toFixed(1) : 0;
  const longWords = words.filter(w => w.replace(/[^a-zA-Z]/g, "").length >= 7).length;
  const readingMinutes = Math.max(1, Math.ceil(words.length / 160));
  const level = avgWordsPerSentence <= 12 && longWords <= words.length * 0.15
    ? "Easy (Accessible)"
    : avgWordsPerSentence <= 18
      ? "Moderate"
      : "Dense (Needs Simplification)";
  return { wordCount: words.length, sentenceCount: sentences.length, avgWordsPerSentence, longWords, readingMinutes, level };
}
