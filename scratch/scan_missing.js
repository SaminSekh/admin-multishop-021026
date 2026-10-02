const fs = require('fs');
const code = fs.readFileSync('c:/Users/sekhc/Downloads/Temp/dolphin-admin-site-main/js/spin.js', 'utf8');

const declared = new Set();
const declMatches = code.matchAll(/\b(?:const|let|var|function|class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g);
for (const m of declMatches) declared.add(m[1]);

const externals = new Set(("Object Array Function String Number Boolean RegExp Date Math JSON Promise Set Map URL URLSearchParams Blob File Image console window document localStorage sessionStorage navigator performance requestAnimationFrame cancelAnimationFrame setTimeout clearTimeout setInterval clearInterval alert confirm prompt parseFloat parseInt isNaN isFinite encodeURIComponent decodeURIComponent AudioContext webkitAudioContext qrcode Intl Infinity undefined null true false this arguments Symbol BigInt Error TypeError ReferenceError Node ELEMENT Text HTMLCanvasElement FormData AbortController MutationObserver crypto atob btoa fetch FormData KeyboardEvent MouseEvent Element Document getComputedStyle").split(' '));

const adminGlobals = new Set(("supabase supabaseClient authManager menuManager permissionManager showNotification showLoading formatCurrency getCurrencySymbol getLocaleForCurrency formatDate debounce escapeHtml compressImage setFavicon applyFavicon initTableSorting initMobileMenu getStoredPerPage saveStoredPerPage renderPerPageControlHTML uploadImageToImgbb loadJsPDF loadJSZip qrcode").split(' '));

// find call-sites identifier(
const calls = new Set();
for (const m of code.matchAll(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g)) {
  calls.add(m[1]);
}

const missing = [...calls].filter(n => !declared.has(n) && !externals.has(n) && !adminGlobals.has(n));
console.log('MISSING (called but not declared):');
missing.forEach(n => console.log('  ' + n));
if (!missing.length) console.log('  none');