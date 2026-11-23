import test from "node:test";
import assert from "node:assert/strict";
import { countSyllables, analyzeReadability, simplifyText, toBionicHtml, computeWcagContrast } from "./access.mjs";

test("countSyllables handles common academic and short words", () => {
  assert.equal(countSyllables("cat"), 1);
  assert.ok(countSyllables("methodology") >= 4);
  assert.ok(countSyllables("accessible") >= 3);
});

test("analyzeReadability computes Flesch-Kincaid grade and flags jargon", () => {
  const dense = "Students must utilize comprehensive methodology to facilitate subsequent implementation of approximately sufficient modifications.";
  const r = analyzeReadability(dense);
  assert.ok(r.fkGrade >= 12);
  assert.ok(r.jargonHits.length >= 4);
  assert.match(r.level, /Dense/);
});

test("simplifyText replaces jargon and splits complex sentences", () => {
  const steps = simplifyText("We utilize a comprehensive methodology; consequently learners demonstrate progress.");
  assert.ok(steps.length >= 2);
  assert.match(steps[0], /use/i);
  assert.match(steps[1], /show/i);
});

test("toBionicHtml bolds leading anchors safely with HTML escaping", () => {
  const html = toBionicHtml("Hello <world>");
  assert.match(html, /<strong>Hel<\/strong>lo/);
  assert.match(html, /&lt;/);
});

test("computeWcagContrast verifies AAA high contrast themes", () => {
  const dark = computeWcagContrast("#f8fafc", "#0f172a");
  assert.equal(dark.aaaNormal, true);
  assert.equal(dark.grade, "WCAG AAA");
  const low = computeWcagContrast("#999999", "#aaaaaa");
  assert.equal(low.aaNormal, false);
});
