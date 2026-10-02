const fs = require('fs');
const content = fs.readFileSync('c:/Users/sekhc/Downloads/Temp/dolphin-admin-site-main/js/spin.js', 'utf8');

const elKeys = [];
const match = content.match(/const el = {([\s\S]*?)};/);
if (match) {
  const elBlock = match[1];
  const keyMatches = elBlock.matchAll(/([a-zA-Z0-9_$]+)\s*:/g);
  for (const m of keyMatches) {
    elKeys.push(m[1]);
  }
}

console.log('Total keys in el:', elKeys.length);

const lines = content.split('\n');
elKeys.forEach(key => {
  lines.forEach((line, idx) => {
    if (idx < 90 || (idx > 260 && idx < 3900)) {
      const regex = new RegExp('\\b' + key + '\\b');
      if (
        regex.test(line) &&
        !line.includes('el.' + key) &&
        !line.includes(key + ':') &&
        !line.includes('const ' + key) &&
        !line.includes('let ' + key) &&
        !line.includes('function ' + key) &&
        !line.includes('//') &&
        !line.includes('"' + key + '"') &&
        !line.includes("'" + key + "'")
      ) {
        console.log(`Line ${idx + 1} (${key}): ${line.trim()}`);
      }
    }
  });
});
