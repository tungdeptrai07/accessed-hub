# AccessED Hub — WCAG AAA Adaptive Learning & Bionic Reading Studio

> Built for **AccessED Hacks 2026** | Live App: **[tungdeptrai07.github.io/accessed-hub](https://tungdeptrai07.github.io/accessed-hub/)**

**AccessED Hub** removes reading and sensory barriers for students with dyslexia, ADHD, low vision, and cognitive fatigue—running 100% locally in the browser with zero sign-up or tracking.

## Core Capabilities
- **Readability & Jargon Diagnostics (`analyzeReadability`):** Computes Flesch-Kincaid Grade Level, Flesch Reading Ease, syllable density, and flags dense academic jargon with plain-language replacements.
- **Plain-Language Step Chunker (`simplifyText`):** Automatically simplifies jargon and breaks run-on academic paragraphs into numbered digestible steps.
- **Bionic Fixation Renderer (`toBionicHtml`) & Focus Reading Ruler:** Anchors leading letters in bold and provides a mouse-tracked line focus ruler to reduce eye-skipping.
- **Verified WCAG 2.1 AAA Themes (`computeWcagContrast`):** Instant switching between Dark Slate, Warm Dyslexia Cream, and High-Contrast Yellow/Black with live contrast ratio verification.
- **Paced Text-to-Speech (Web Speech API) & Markdown Study Guide Export.**

## Automated Unit Tests
```bash
node --test access.test.mjs
```
