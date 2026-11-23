/**
 * AccessED Hub — Adaptive Accessible Learning, Readability & WCAG 2.1 AAA Engine
 * Zero-dependency ES Module empowering learners with dyslexia, ADHD, and visual fatigue:
 *  - Flesch-Kincaid Grade Level & Flesch Reading Ease scoring
 *  - Automated plain-language jargon detection & sentence chunking
 *  - Bionic fixation renderer (bolding initial word anchors)
 *  - WCAG 2.1 relative luminance & contrast ratio verifier (AA / AAA)
 */

const JARGON_MAP = {
  utilize: "use",
  facilitate: "help",
  subsequently: "later",
  approximately: "about",
  demonstrate: "show",
  methodology: "method",
  implementation: "setup",
  comprehensive: "complete",
  consequently: "so",
  nevertheless: "still",
  commence: "start",
  terminate: "end",
  acquire: "get",
  modifications: "changes",
  sufficient: "enough"
};

export function countSyllables(word) {
  const clean = String(word || "").toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 0;
  if (clean.length <= 3) return 1;
  const trimmed = clean.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function analyzeReadability(text) {
  const raw = String(text || "").trim();
  if (!raw) {
    return {
      wordCount: 0, sentenceCount: 0, syllableCount: 0,
      avgWordsPerSentence: 0, longWords: 0, readingMinutes: 0,
      fleschEase: 100, fkGrade: 0, level: "Empty", jargonHits: []
    };
  }
  const words = raw.split(/\s+/).filter(Boolean);
  const sentences = raw.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sCount = Math.max(1, sentences.length);
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgWordsPerSentence = +(words.length / sCount).toFixed(1);
  const avgSyllablesPerWord = syllables / Math.max(1, words.length);
  const longWords = words.filter(w => countSyllables(w) >= 3).length;

  const fleschEase = Math.max(0, Math.min(100, +(206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord).toFixed(1)));
  const fkGrade = Math.max(0, +(0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59).toFixed(1));
  const readingMinutes = Math.max(1, Math.ceil(words.length / 160));

  const level = fkGrade <= 7
    ? "Accessible (Grade <= 7)"
    : fkGrade <= 11
      ? "Moderate (High School)"
      : "Dense (College / Technical — Simplify Recommended)";

  const lowerWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, "")));
  const jargonHits = Object.entries(JARGON_MAP)
    .filter(([complex]) => lowerWords.has(complex))
    .map(([complex, simple]) => ({ complex, simple }));

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    syllableCount: syllables,
    avgWordsPerSentence,
    longWords,
    readingMinutes,
    fleschEase,
    fkGrade,
    level,
    jargonHits
  };
}

export function simplifyText(text) {
  let out = String(text || "");
  for (const [complex, simple] of Object.entries(JARGON_MAP)) {
    const re = new RegExp(`\\b${complex}\\b`, "gi");
    out = out.replace(re, (m) => (m[0] === m[0].toUpperCase() ? simple[0].toUpperCase() + simple.slice(1) : simple));
  }
  // Break overly long sentences at semicolons or ", and " / ", which " into readable bullet steps
  return out
    .replace(/;\s+/g, ".\n")
    .replace(/,\s+(?:which|however|consequently|therefore)\s+/gi, ". ")
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

export function toBionicHtml(text) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return String(text || "")
    .split(/(\s+)/)
    .map(tok => {
      if (/^\s+$/.test(tok)) return tok;
      const letters = tok.length;
      const cut = letters <= 3 ? 1 : Math.ceil(letters * 0.45);
      return `<strong>${esc(tok.slice(0, cut))}</strong>${esc(tok.slice(cut))}`;
    })
    .join("");
}

function hexToRgb(hex) {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance([r, g, b]) {
  const lin = [r, g, b].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function computeWcagContrast(fgHex, bgHex) {
  const l1 = relativeLuminance(hexToRgb(fgHex));
  const l2 = relativeLuminance(hexToRgb(bgHex));
  const ratio = +((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2);
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaaNormal: ratio >= 7.0,
    grade: ratio >= 7.0 ? "WCAG AAA" : ratio >= 4.5 ? "WCAG AA" : "Needs Higher Contrast"
  };
}
