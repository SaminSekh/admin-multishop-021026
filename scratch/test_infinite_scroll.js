// Test verification for Infinite Scroll with Pagination (Load-on-Scroll in batches of 10)
const assert = require('assert');

class MockProductGrid {
    constructor() {
        this.innerHTML = '';
        this.children = [];
    }

    insertAdjacentHTML(position, html) {
        if (position === 'beforebegin') {
            this.innerHTML = html + this.innerHTML;
        } else if (position === 'beforeend') {
            this.innerHTML += html;
        }
    }
}

class MockViewer {
    constructor(products) {
        this.products = products;
        this.filteredProducts = [...products];
        this.productsPerPage = 10;
        this.currentProductPage = 1;
        this.isLoadingNextBatch = false;
        this.grid = new MockProductGrid();
        this.sentinel = { insertAdjacentHTML: (pos, html) => { this.appendedCards.push(html); } };
        this.appendedCards = [];
        this.observerDisconnected = false;
        this.shopSettings = { currency: 'INR' };
        this.assetBase = '';
    }

    getAssetUrl(p) { return p; }
    formatCurrency(val, curr) { return `₹${val}`; }
    getProductLowestPrice(p) { return p.price || 100; }

    createProductCardHtml(product) {
        return `<div class="public-product-card" data-product-id="${product.id}"><h3>${product.product_name}</h3></div>`;
    }

    renderProducts() {
        this.currentProductPage = 1;
        this.isLoadingNextBatch = false;
        this.appendedCards = [];

        const totalProducts = this.filteredProducts.length;
        if (totalProducts === 0) {
            this.grid.innerHTML = 'No products found';
            return;
        }

        const initialBatch = this.filteredProducts.slice(0, this.productsPerPage);
        const cardsHtml = initialBatch.map(p => this.createProductCardHtml(p)).join('');
        const totalPages = Math.ceil(totalProducts / this.productsPerPage);
        const loadedCount = Math.min(this.productsPerPage, totalProducts);
        const progressPct = Math.min(100, Math.round((loadedCount / totalProducts) * 100));

        this.grid.innerHTML = cardsHtml;
        this.loadedCount = loadedCount;
        this.totalPages = totalPages;
        this.progressPct = progressPct;
        this.allLoaded = loadedCount >= totalProducts;
    }

    loadNextProductBatch() {
        if (this.isLoadingNextBatch) return;
        const total = this.filteredProducts.length;
        const currentLoaded = this.currentProductPage * this.productsPerPage;
        if (currentLoaded >= total) return;

        this.isLoadingNextBatch = true;
        const nextBatch = this.filteredProducts.slice(currentLoaded, currentLoaded + this.productsPerPage);
        this.currentProductPage++;

        const newCardsHtml = nextBatch.map(p => this.createProductCardHtml(p)).join('');
        this.sentinel.insertAdjacentHTML('beforebegin', newCardsHtml);

        this.loadedCount = Math.min(this.currentProductPage * this.productsPerPage, total);
        this.totalPages = Math.ceil(total / this.productsPerPage);
        this.progressPct = Math.min(100, Math.round((this.loadedCount / total) * 100));
        this.allLoaded = this.loadedCount >= total;

        if (this.allLoaded) {
            this.observerDisconnected = true;
        }
        this.isLoadingNextBatch = false;
    }
}

// Generate 25 sample products
const sampleProducts = Array.from({ length: 25 }, (_, i) => ({
    id: `prod_${i + 1}`,
    product_name: `Product ${i + 1}`,
    price: 100 + i * 10,
    type: 'Apparel'
}));

const viewer = new MockViewer(sampleProducts);

// Test 1: Initial Render
viewer.renderProducts();
assert.strictEqual(viewer.currentProductPage, 1);
assert.strictEqual(viewer.loadedCount, 10, 'First batch must have exactly 10 items');
assert.strictEqual(viewer.totalPages, 3);
assert.strictEqual(viewer.progressPct, 40); // 10/25 = 40%
assert.strictEqual(viewer.allLoaded, false);
console.log('Test 1 Passed: Initial render loads batch 1 of 10 items with 40% progress');

// Test 2: User scrolls to bottom -> load next batch of 10 items
viewer.loadNextProductBatch();
assert.strictEqual(viewer.currentProductPage, 2);
assert.strictEqual(viewer.loadedCount, 20, 'Second batch must bring total to 20 items');
assert.strictEqual(viewer.progressPct, 80); // 20/25 = 80%
assert.strictEqual(viewer.allLoaded, false);
console.log('Test 2 Passed: First load-on-scroll loads next 10 items (20 total, 80% progress)');

// Test 3: User scrolls to bottom again -> load final batch (5 items)
viewer.loadNextProductBatch();
assert.strictEqual(viewer.currentProductPage, 3);
assert.strictEqual(viewer.loadedCount, 25, 'Final batch brings total to 25 items');
assert.strictEqual(viewer.progressPct, 100); // 25/25 = 100%
assert.strictEqual(viewer.allLoaded, true);
assert.strictEqual(viewer.observerDisconnected, true, 'Observer must disconnect when all items are loaded');
console.log('Test 3 Passed: Final batch brings total to 25 items with 100% progress and disconnects observer');

// Test 4: Subsequent scroll trigger after all items are loaded does nothing
const prevCount = viewer.loadedCount;
viewer.loadNextProductBatch();
assert.strictEqual(viewer.loadedCount, prevCount, 'Must not load beyond total products');
console.log('Test 4 Passed: Guard successfully prevents loading beyond total items');

// Test 5: Filter change resets to batch 1 (first 10 items of filtered list)
viewer.filteredProducts = sampleProducts.slice(0, 15);
viewer.renderProducts();
assert.strictEqual(viewer.currentProductPage, 1);
assert.strictEqual(viewer.loadedCount, 10);
assert.strictEqual(viewer.totalPages, 2);
assert.strictEqual(viewer.progressPct, 67); // 10/15 = 67%
assert.strictEqual(viewer.allLoaded, false);
console.log('Test 5 Passed: Filter change resets to batch 1 with updated total pages & progress');

console.log('ALL INFINITE SCROLL PAGINATION TESTS PASSED SUCCESSFULLY!');
