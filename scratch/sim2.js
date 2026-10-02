const fs = require('fs');

function makeCtx() {
  const grad = { addColorStop() {} };
  return new Proxy({}, {
    get(t, k) {
      if (k === 'createLinearGradient' || k === 'createRadialGradient' || k === 'createPattern') return () => grad;
      if (k === 'measureText') return () => ({ width: 0 });
      if (k === 'getImageData') return () => ({ data: [] });
      if (k === 'canvas') return {};
      if (typeof k === 'string' && k !== 'then') return () => {};
      return t[k];
    },
    set(t, k, v) { t[k] = v; return true; }
  });
}

function makeEl() {
  const classes = new Set();
  const el = {
    id: '', _classState: classes, style: {}, dataset: {},
    classList: {
      add: (...cs) => cs.forEach(c => classes.add(c)),
      remove: (...cs) => cs.forEach(c => classes.delete(c)),
      toggle: (c, force) => { const on = force === undefined ? !classes.has(c) : force; on ? classes.add(c) : classes.delete(c); return on; },
      contains: (c) => classes.has(c),
    },
    getContext: () => makeCtx(),
    addEventListener() {}, removeEventListener() {},
    appendChild() { return el; }, remove() {},
    cloneNode: () => makeEl(),
    querySelector: () => makeEl(), querySelectorAll: () => [],
    closest: () => null, getAttribute: () => null, setAttribute() {},
    focus() {}, click() {}, scrollIntoView() {}, closestSelector: null,
  };
  Object.defineProperty(el, 'content', { get() { return { firstElementChild: makeEl() }; } });
  return el;
}

const _byId = (id) => { const e = makeEl(); e.id = id; return e; };

const storage = (() => { const m = {}; return {
  getItem: (k) => (k in m ? m[k] : null),
  setItem: (k, v) => { m[k] = String(v); },
  removeItem: (k) => { delete m[k]; },
  clear: () => { for (const k of Object.keys(m)) delete m[k]; }
};})();

const head = makeEl();
const capturedScripts = [];

global.document = {
  readyState: 'complete',
  getElementById: _byId,
  querySelector: () => makeEl(),
  querySelectorAll: () => [],
  createElement: (tag) => { const e = makeEl(); e.tagName = (tag || 'div').toUpperCase(); return e; },
  createTextNode: () => ({}),
  addEventListener() {}, removeEventListener() {},
  body: makeEl(),
  head: {
    ...makeEl(),
    appendChild: (s) => { if (s.src) capturedScripts.push(s); return s; },
  },
};

global.window = {
  location: { search: '', pathname: 'spin.html', href: 'http://localhost/spin.html' },
  addEventListener() {}, removeEventListener() {}, innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1,
};
global.window.window = global.window;

global.localStorage = storage;
global.sessionStorage = storage;
global.Image = class { set src(v) {} };
global.qrcode = () => ({ addData() {}, make() {}, getModuleCount() { return 21; }, isDark() { return false; } });
global.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 1);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.navigator = { userAgent: 'node' };

storage.setItem('currentUser', JSON.stringify({ shop_id: 'SHOP1', full_name: 'Test Admin' }));
storage.setItem('gs_secondary_sheet_url_SHOP1', 'https://script.google.com/macros/s/AKfycbyltcB5TcqISvcbIcs3ka3RjaFa1IT8ZxiHDeIA30g01BirlBmnzg2dy7xN0knQAsMAww/exec');

const code = fs.readFileSync('c:/Users/sekhc/Downloads/Temp/dolphin-admin-site-main/js/spin.js', 'utf8');

const probe = `
;(async () => {
  const finish = (tag, info) => { console.log('PROBE_RESULT ' + JSON.stringify({ tag, info })); process.exit(0); };
  setTimeout(() => {
    const actions = capturedScripts.map(s => (s.src.match(/action=([a-z_]+)/i) || [])[1] || null);
    for (const s of capturedScripts) {
      const src = s.src;
      const action = (src.match(/action=([a-z_]+)/i) || [])[1];
      const cb = (src.match(/callback=([a-z0-9_]+)/i) || [])[1];
      if (!cb) continue;
      if (action === 'settings') {
        const sheetSettings = {
          shopName: 'SHEET SHOP NAME',
          shopLogoUrl: '',
          expiryHours: 99,
          spinDuration: 6,
          prizes: [
            { id: 'srv-p1', name: 'Sheet Prize One', probability: 40, enabled: true },
            { id: 'srv-p2', name: 'Sheet Prize Two', probability: 60, enabled: true },
          ],
        };
        setTimeout(() => { try { window[cb]({ ok: true, settings: sheetSettings }); } catch (e) { finish('CALLBACK_THREW', { name: e.name, message: e.message }); } }, 2);
      } else if (action === 'list') {
        setTimeout(() => { try { window[cb]({ ok: true, records: [] }); } catch (e) {} }, 2);
      } else if (action === 'members') {
        setTimeout(() => { try { window[cb]({ ok: true, members: [] }); } catch (e) {} }, 2);
      }
    }
    if (!actions.includes('settings')) finish('NO_SETTINGS_REQUEST', { actions, urlBefore: getAppsScriptUrl() });
  }, 5);
  setTimeout(() => {
    finish('AFTER', {
      urlResolved: getAppsScriptUrl(),
      actions: capturedScripts.map(s => (s.src.match(/action=([a-z_]+)/i) || [])[1] || null),
      shopNameInputValue: el.shopNameInput && el.shopNameInput.value,
      stateShopName: state.settings.shopName,
      expiryHours: state.settings.expiryHours,
      spinDuration: state.settings.spinDuration,
      conditionsLen: (state.settings.conditions || []).length,
      condLabel: state.settings.conditions && state.settings.conditions[0] && state.settings.conditions[0].label,
      condPrizes: state.settings.conditions && state.settings.conditions[0] && state.settings.conditions[0].prizes.length,
    });
  }, 300);
})();
`;

try {
  eval(code + probe);
} catch (e) {
  console.log('PROBE_RESULT ' + JSON.stringify({ tag: 'TOP_LEVEL_THREW', name: e.name, message: e.message }));
  process.exit(0);
}
setTimeout(() => { console.log('PROBE_RESULT ' + JSON.stringify({ tag: 'TIMEOUT' })); process.exit(0); }, 15000);