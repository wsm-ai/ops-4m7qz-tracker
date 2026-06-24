#!/usr/bin/env node
// Syntax-check the main <script> in index.html without executing it.
// Usage: node scripts/check_syntax.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

const m = html.match(/<script>\s*"use strict"([\s\S]*?)<\/script>/);
if (!m) {
  console.error("ERROR: could not find the main <script> (expected it to start with \"use strict\").");
  process.exit(1);
}
const body = m[1];

let qb = "";
try { qb = fs.readFileSync(path.join(ROOT, "quizbank.js"), "utf8"); } catch (_) {}

// Stub the browser globals the script references at parse/define time so `new Function`
// can compile it. This validates SYNTAX only; it does not run the app.
const stub = {
  window: {}, document: {
    getElementById: () => ({ onclick: null, click: () => {}, value: "", style: {}, classList: { add: () => {}, remove: () => {} }, addEventListener: () => {}, onchange: null, querySelector: () => null, options: [], innerHTML: "" }),
    querySelector: () => null, querySelectorAll: () => [], addEventListener: () => {}, createElement: () => ({ style: {}, click: () => {} })
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  navigator: { serviceWorker: { register: () => ({ catch: () => {} }) } },
  prompt: () => "", confirm: () => true, alert: () => {},
  structuredClone: (x) => JSON.parse(JSON.stringify(x)),
  setTimeout: () => {}, setInterval: () => {}, clearTimeout: () => {}, clearInterval: () => {},
  performance: { now: () => 0 }, Blob: function () {}, URL: { createObjectURL: () => "", revokeObjectURL: () => {} },
  FileReader: function () {}, console
};

try {
  // eslint-disable-next-line no-new-func
  new Function(...Object.keys(stub), qb + "\nvar QUIZ_BANK=window.QUIZ_BANK;\n" + body);
  console.log("SYNTAX OK");
} catch (e) {
  console.error("SYNTAX ERROR:", e.message);
  process.exit(1);
}
