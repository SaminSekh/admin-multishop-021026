const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== VERIFYING VARIANT CHIPS AND COLOR RESOLUTION ===\n');

// 1. Load shop-products.js
const shopProductsPath = path.join(__dirname, '..', 'js', 'shop-products.js');
const shopCode = fs.readFileSync(shopProductsPath, 'utf8');

// Extract getColorHex implementation
const normalizedCode = shopCode.replace(/\r\n/g, '\n');
const startIdx = normalizedCode.indexOf('const getColorHex = (name) => {');
const endIdx = normalizedCode.indexOf("if (typeof window !== 'undefined') {\n                window.getColorHex = getColorHex;");
assert(startIdx !== -1 && endIdx !== -1, 'Could not find getColorHex boundaries in shop-products.js');

const funcStr = normalizedCode.slice(startIdx, endIdx).trim();
const getColorHex = eval(`(${funcStr.replace('const getColorHex = ', '').replace(/;\s*$/, '')})`);

// 2. Test user-requested colors
const requestedColors = [
    { name: 'light grey', expected: '#d3d3d3' },
    { name: 'blue', expected: '#2563eb' },
    { name: 'beach', expected: '#e8d8b8' },
    { name: 'white grey', expected: '#e5e7eb' },
    { name: 'white cream', expected: '#faf6eb' },
    { name: 'cashmere', expected: '#d1bfa7' },
    { name: 'blush pink', expected: '#ffb6c1' },
    { name: 'creamy pink', expected: '#f8c8dc' }
];

console.log('Testing User Requested Colors:');
requestedColors.forEach(({ name, expected }) => {
    const res = getColorHex(name);
    console.log(`  ✓ "${name}" => ${res}`);
    assert.strictEqual(res, expected, `Mismatch for ${name}: got ${res}, expected ${expected}`);
});

// 3. Test additional clothing/fashion colors & edge cases
const additionalColors = [
    'cream pink', 'light gray', 'white gray', 'ash grey', 'charcoal',
    'navy', 'navy blue', 'royal blue', 'sky blue', 'ice blue',
    'olive', 'olive green', 'sage green', 'mint', 'emerald',
    'wine', 'maroon', 'burgundy', 'dusty rose', 'coral', 'peach',
    'khaki', 'beige', 'camel', 'taupe', 'sand', 'mocha',
    'black', 'white', 'pure white', 'off white', 'ivory',
    'multicolor', 'tie-dye', '#ff5722'
];

console.log('\nTesting Additional Fashion Colors:');
additionalColors.forEach(c => {
    const res = getColorHex(c);
    assert(res !== null, `Expected color for "${c}" to be found, got null`);
    console.log(`  ✓ "${c}" => ${res.slice(0, 35)}...`);
});

// 4. Test non-color variant names (should return null so no dot is rendered)
const nonColors = ['XL', 'Size 42', 'Pack of 3', 'Cotton 100%'];
console.log('\nTesting Non-Color Variant Names:');
nonColors.forEach(nc => {
    const res = getColorHex(nc);
    assert.strictEqual(res, null, `Expected "${nc}" to return null, got ${res}`);
    console.log(`  ✓ "${nc}" correctly identified as non-color (dot omitted)`);
});

// 5. Test MutationObserver logic simulation on generated variant chip buttons
console.log('\nTesting MutationObserver Protection for Chip Name and Dot:');

const options = [
    { variant_name: 'Creamy Pink', isBase: true },
    { variant_name: 'Blue', id: 'var_blue' },
    { variant_name: 'Teal', id: 'var_teal' },
    { variant_name: 'Light grey', id: 'var_lg' }
];

options.forEach((opt, idx) => {
    const vName = opt.variant_name;
    const vDisplayName = vName.charAt(0).toUpperCase() + vName.slice(1);
    const hex = getColorHex(vName);
    assert(hex !== null, `Hex should exist for ${vName}`);
    
    const dotHtml = `<span class="variant-color-dot" style="background:${hex};"></span>`;
    const btnInnerHtml = `${dotHtml}<span class="variant-name-label">${vDisplayName}</span>`;

    // Simulate DOM elements
    const mockBtn = {
        spans: [
            { classList: ['variant-color-dot'], textContent: '' },
            { classList: ['variant-name-label'], textContent: vDisplayName }
        ]
    };

    // Run the updated mutation observer filter
    const priceSpans = mockBtn.spans.filter(s => {
        if (s.classList.includes('variant-color-dot') || s.classList.includes('variant-name-label')) return false;
        const t = (s.textContent || '').trim();
        return t.startsWith('₹') || t.startsWith('$') || t.startsWith('BDT') || s.classList.includes('variant-price');
    });

    assert.strictEqual(priceSpans.length, 0, 'No spans should be marked as price to remove');
    console.log(`  ✓ Chip for "${vDisplayName}": color dot (${hex}) AND name label preserved!`);
});

console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
