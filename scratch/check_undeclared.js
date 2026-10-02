const fs = require('fs');
const code = fs.readFileSync('c:/Users/sekhc/Downloads/Temp/dolphin-admin-site-main/js/spin.js', 'utf8');

// Use simple regex to find variable references in statements
const words = new Set(code.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g));

// Declared keywords, standard globals, functions, consts, lets, vars
const declared = new Set();
const declMatches = code.matchAll(/\b(?:const|let|var|function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
for (const m of declMatches) {
  declared.add(m[1]);
}

// Function parameters
const paramMatches = code.matchAll(/function\s*(?:[a-zA-Z_$][a-zA-Z0-9_$]*)?\s*\(([^)]*)\)/g);
for (const m of paramMatches) {
  const params = m[1].split(',');
  params.forEach(p => {
    const clean = p.trim().split('=')[0].trim();
    if (clean) declared.add(clean);
  });
}
const arrowParamMatches = code.matchAll(/\(([^)]*)\)\s*=>/g);
for (const m of arrowParamMatches) {
  const params = m[1].split(',');
  params.forEach(p => {
    const clean = p.trim().split('=')[0].trim();
    if (clean) declared.add(clean);
  });
}

const standardGlobals = new Set([
  'Object', 'Array', 'Function', 'String', 'Number', 'Boolean', 'RegExp', 'Date', 'Math', 'JSON', 'Promise', 'Set', 'Map',
  'URL', 'URLSearchParams', 'Blob', 'File', 'Image', 'console', 'window', 'document', 'localStorage', 'sessionStorage',
  'navigator', 'performance', 'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout', 'setInterval',
  'clearInterval', 'alert', 'confirm', 'prompt', 'parseFloat', 'parseInt', 'isNaN', 'isFinite', 'encodeURIComponent',
  'decodeURIComponent', 'AudioContext', 'webkitAudioContext', 'qrcode', 'Intl', 'Math', 'Infinity', 'undefined', 'null',
  'true', 'false', 'this', 'arguments', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'return', 'break',
  'continue', 'try', 'catch', 'finally', 'throw', 'new', 'typeof', 'instanceof', 'void', 'delete', 'in', 'of', 'const',
  'let', 'var', 'function', 'async', 'await', 'import', 'export', 'from', 'as', 'class', 'extends', 'super', 'static'
]);

const elKeys = new Set();
const match = code.match(/const el = {([\s\S]*?)};/);
if (match) {
  const elBlock = match[1];
  const keyMatches = elBlock.matchAll(/([a-zA-Z0-9_$]+)\s*:/g);
  for (const m of keyMatches) {
    elKeys.add(m[1]);
  }
}

console.log('Checking keys in el that might be used without el. prefix:');
for (const key of elKeys) {
  if (!declared.has(key) && !standardGlobals.has(key)) {
    // Search for usage without el.
    const reg = new RegExp('(?<!el\\.)\\b' + key + '\\b', 'g');
    const matches = Array.from(code.matchAll(reg));
    const nonDefMatches = matches.filter(m => {
      const idx = m.index;
      const before = code.slice(Math.max(0, idx - 30), idx);
      const after = code.slice(idx, Math.min(code.length, idx + 30));
      return !before.includes(key + ':') && !before.includes('const el =');
    });
    if (nonDefMatches.length > 0) {
      console.log(`Key '${key}' is used without 'el.' ${nonDefMatches.length} time(s)!`);
    }
  }
}
