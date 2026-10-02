// Simulation test for PWA install popup logic
const assert = require('assert');

// Mock browser globals
class StorageMock {
    constructor() { this.store = {}; }
    getItem(k) { return this.store[k] || null; }
    setItem(k, v) { this.store[k] = String(v); }
    removeItem(k) { delete this.store[k]; }
    clear() { this.store = {}; }
}

function createEnvironment(options = {}) {
    const localStorage = new StorageMock();
    const sessionStorage = new StorageMock();
    if (options.initialLocal) {
        Object.entries(options.initialLocal).forEach(([k, v]) => localStorage.setItem(k, v));
    }
    if (options.initialSession) {
        Object.entries(options.initialSession).forEach(([k, v]) => sessionStorage.setItem(k, v));
    }

    const window = {
        matchMedia: (query) => ({
            matches: options.isStandalone || false
        }),
        navigator: {
            standalone: options.navigatorStandalone || false,
            userAgent: options.userAgent || 'Mozilla/5.0 (Linux; Android 13; Mobile)'
        }
    };

    let popupShown = false;
    let installContainerHidden = false;

    const mockViewer = {
        isAppAlreadyInstalled() {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                                 window.matchMedia('(display-mode: fullscreen)').matches ||
                                 window.matchMedia('(display-mode: minimal-ui)').matches ||
                                 window.navigator.standalone === true;
            if (isStandalone) {
                try { localStorage.setItem('pwa_app_installed', 'true'); } catch (e) {}
                return true;
            }
            try {
                if (localStorage.getItem('pwa_app_installed') === 'true') {
                    return true;
                }
            } catch (e) {}
            return false;
        },

        async checkInstalledRelatedApps() {
            return options.hasRelatedApp || false;
        },

        showApkInstallPopup() {
            if (this.isAppAlreadyInstalled()) return;
            popupShown = true;
        },

        initApkInstallPopup(clockNow = Date.now()) {
            if (this.apkPopupInitialized) return;
            this.apkPopupInitialized = true;

            if (this.isAppAlreadyInstalled()) {
                installContainerHidden = true;
                return { scheduled: false, reason: 'already_installed' };
            }

            // Visit session tracking
            const now = clockNow;
            try {
                const lastActivity = parseInt(sessionStorage.getItem('pwa_visit_last_activity') || '0', 10);
                if (!lastActivity || (now - lastActivity > 30 * 60 * 1000)) {
                    sessionStorage.removeItem('pwa_popup_shown_in_visit');
                }
                sessionStorage.setItem('pwa_visit_last_activity', now.toString());

                if (sessionStorage.getItem('pwa_popup_shown_in_visit')) {
                    return { scheduled: false, reason: 'already_shown_in_current_visit' };
                }
            } catch (e) {}

            return {
                scheduled: true,
                delay: 10000,
                triggerPopup: () => {
                    if (this.isAppAlreadyInstalled()) return;
                    sessionStorage.setItem('pwa_popup_shown_in_visit', 'true');
                    this.showApkInstallPopup();
                }
            };
        }
    };

    return { mockViewer, localStorage, sessionStorage, getPopupShown: () => popupShown, isInstallContainerHidden: () => installContainerHidden };
}

// Test 1: New visit, uninstalled user -> 10s timer scheduled, triggers popup
{
    const env = createEnvironment();
    const res = env.mockViewer.initApkInstallPopup();
    assert.strictEqual(res.scheduled, true);
    assert.strictEqual(res.delay, 10000);
    assert.strictEqual(env.getPopupShown(), false);
    
    // Timer fires after 10s
    res.triggerPopup();
    assert.strictEqual(env.getPopupShown(), true);
    assert.strictEqual(env.sessionStorage.getItem('pwa_popup_shown_in_visit'), 'true');
    console.log('Test 1 passed: New visit schedules 10s popup for uninstalled user');
}

// Test 2: Same visit navigation -> Not scheduled again in same visit
{
    const env = createEnvironment({ initialSession: { 'pwa_popup_shown_in_visit': 'true', 'pwa_visit_last_activity': Date.now().toString() } });
    const res = env.mockViewer.initApkInstallPopup();
    assert.strictEqual(res.scheduled, false);
    assert.strictEqual(res.reason, 'already_shown_in_current_visit');
    console.log('Test 2 passed: Suppressed within same visit session to avoid spamming user');
}

// Test 3: Returning visit after 30 mins -> Schedules 10s popup again
{
    const t0 = 1000000;
    const env = createEnvironment({ initialSession: { 'pwa_popup_shown_in_visit': 'true', 'pwa_visit_last_activity': t0.toString() } });
    const res = env.mockViewer.initApkInstallPopup(t0 + 35 * 60 * 1000); // 35 minutes later
    assert.strictEqual(res.scheduled, true);
    assert.strictEqual(res.delay, 10000);
    console.log('Test 3 passed: New visit after 30 mins schedules 10s popup');
}

// Test 4: User ALREADY INSTALLED (standalone mode) -> NEVER scheduled, NEVER shown
{
    const env = createEnvironment({ isStandalone: true });
    const res = env.mockViewer.initApkInstallPopup();
    assert.strictEqual(res.scheduled, false);
    assert.strictEqual(res.reason, 'already_installed');
    assert.strictEqual(env.isInstallContainerHidden(), true);
    assert.strictEqual(env.localStorage.getItem('pwa_app_installed'), 'true');
    console.log('Test 4 passed: Standalone installed users NEVER see popup');
}

// Test 5: User ALREADY INSTALLED (localStorage persistent flag) -> NEVER scheduled, NEVER shown
{
    const env = createEnvironment({ initialLocal: { 'pwa_app_installed': 'true' } });
    const res = env.mockViewer.initApkInstallPopup();
    assert.strictEqual(res.scheduled, false);
    assert.strictEqual(res.reason, 'already_installed');
    assert.strictEqual(env.isInstallContainerHidden(), true);
    console.log('Test 5 passed: Previously installed users visiting in regular browser NEVER see popup');
}

// Test 6: User installs via popup -> saves flag, future visits suppressed
{
    const env = createEnvironment();
    const res = env.mockViewer.initApkInstallPopup();
    res.triggerPopup();
    assert.strictEqual(env.getPopupShown(), true);

    // User accepts installation
    env.localStorage.setItem('pwa_app_installed', 'true');

    // Subsequent visit in a new session
    const envNextVisit = createEnvironment({ initialLocal: env.localStorage.store });
    const resNext = envNextVisit.mockViewer.initApkInstallPopup();
    assert.strictEqual(resNext.scheduled, false);
    assert.strictEqual(resNext.reason, 'already_installed');
    console.log('Test 6 passed: Post-install state permanently suppresses future popups');
}

console.log('ALL 6 TESTS PASSED SUCCESSFULLY!');
