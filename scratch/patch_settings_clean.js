const fs = require('fs');

let current = fs.readFileSync('c:/Users/sekhc/Downloads/Temp/dolphin-admin-site-main/js/spin.js', 'utf8');
const cleanBlock = fs.readFileSync('c:/Users/sekhc/Downloads/Temp/dolphin-admin-site-main/scratch/clean_settings_block.js', 'utf8');

const safeBlock = cleanBlock.replace(
  'el.appsScriptUrlInput.value = state.settings.appsScriptUrl || "";',
  'if (el.appsScriptUrlInput) el.appsScriptUrlInput.value = state.settings.appsScriptUrl || getAppsScriptUrl();'
);

current = current.replace(/function applySettingsFromServer[\s\S]*?\nfunction syncPrizeDraftFromTable/, safeBlock + '\n\nfunction syncPrizeDraftFromTable');

fs.writeFileSync('c:/Users/sekhc/Downloads/Temp/dolphin-admin-site-main/js/spin.js', current, 'utf8');
console.log('Successfully patched applySettingsFromServer block in js/spin.js!');
