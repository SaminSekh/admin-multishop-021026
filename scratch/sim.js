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
    id: '',
    _classState: classes,
    style: {},
    dataset: {},
    classList: {
      add: (...cs) => cs.forEach(c => classes.add(c)),
      remove: (...cs) => cs.forEach(c => classes.delete(c)),
      toggle: (c, force) => { const on = force === undefined ? !classes.has(c) : force; on ? classes.add(c) : classes.delete(c); return on; },
      contains: (c) => classes.has(c),
    },
    getContext: () => makeCtx(),
    addEventListener() {},
    removeEventListener() {},
    appendChild() { return el; },
    remove() {},
    cloneNode: () => makeEl(),
    querySelector: () => makeEl(),
    querySelectorAll: () => [],
    closest: () => null,
    getAttribute: () => null,
    setAttribute() {},
    focus() {},
    click() {},
    scrollIntoView() {},
    closestSelector: null,
  };
  Object.defineProperty(el, 'content', { get() { return { firstElementChild: makeEl() }; } });
  return el;
}

const _byId = (id) => {
  const e = makeEl();
  e.id = id;
  return e;
};

const storage = (() => { const m = {}; return {
  getItem: (k) => (k in m ? m[k] : null),
  setItem: (k, v) => { m[k] = String(v); },
  removeItem: (k) => { delete m[k]; },
  clear: () => { for (const k of Object.keys(m)) delete m[k]; }
};})();

global.document = {
  readyState: 'complete',
  getElementById: _byId,
  querySelector: () => makeEl(),
  querySelectorAll: () => [],
  createElement: (tag) => { const e = makeEl(); e.tagName = (tag || 'div').toUpperCase(); return e; },
  createTextNode: () => ({}),
  addEventListener() {},
  removeEventListener() {},
  body: makeEl(),
  head: makeEl(),
};

global.window = {
  location: { search: '', pathname: 'spin.html', href: 'http://localhost/spin.html' },
  addEventListener() {},
  removeEventListener() {},
  innerWidth: 1280,
  innerHeight: 800,
  devicePixelRatio: 1,
};
global.window.window = global.window;

global.localStorage = storage;
global.sessionStorage = storage;
global.Image = class { set src(v) {} };
global.qrcode = () => ({ addData() {}, make() {}, getModuleCount() { return 21; }, isDark() { return false; } });
global.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 1);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.navigator = { userAgent: 'node' };

const code = fs.readFileSync('c:/Users/sekhc/Downloads/Temp/dolphin-admin-site-main/js/spin.js', 'utf8');

const testProbe = `
;(async () => {
  const finish = (tag, info) => {
    console.log('PROBE_RESULT ' + JSON.stringify({ tag, info }));
    process.exit(0);
  };
  try {
    state.settings.spinDuration = 0.05;
    state.selectedConditionId = (state.settings.conditions && state.settings.conditions[0] && state.settings.conditions[0].id) || null;
    if (el.spinConditionSelect) el.spinConditionSelect.value = state.selectedConditionId || "";
    el.customerName.value = "Aisyah";
    el.purchaseAmount.value = "150";
    await onSpinClick();
    const hiddenStill = el.winnerModal ? el.winnerModal.classList.contains("hidden") : "no-el";
    finish("SPIN_OK", { hidden: hiddenStill, prize: el.winnerPrizeName && el.winnerPrizeName.textContent, recCount: state.records.length, currentId: state.currentResultId, hint: el.wheelHint && el.wheelHint.textContent });
  } catch (e) {
    finish("SPIN_THREW", { name: e && e.name, message: e && e.message, stack: e && e.stack });
  }
})();
`;

try {
  eval(code + testProbe);
} catch (e) {
  console.log('PROBE_RESULT ' + JSON.stringify({ tag: 'TOP_LEVEL_THREW', name: e.name, message: e.message, stack: e.stack }));
  process.exit(0);
}
setTimeout(() => { console.log('PROBE_RESULT ' + JSON.stringify({ tag: 'TIMEOUT' })); process.exit(0); }, 20000);