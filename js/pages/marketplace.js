/**
 * ARTISAN MARKETPLACE
 * Dynamic Marketplace Catalog Script
 */

const MarketplacePage = {

    init() {
        this.renderProducts();
        this.bindEvents();
    },

    bindEvents() {
        const searchInput = document.getElementById("searchInput");
        const categoryFilter = document.getElementById("categoryFilter");
        const sortFilter = document.getElementById("sortFilter");

        if (searchInput) {
            searchInput.addEventListener("input", () => this.renderProducts());
        }
        if (categoryFilter) {
            categoryFilter.addEventListener("change", () => this.renderProducts());
        }
        if (sortFilter) {
            sortFilter.addEventListener("change", () => this.renderProducts());
        }
    },

    renderProducts() {
        const grid = document.getElementById("marketplaceGrid");
        if (!grid) return;

        const search = document.getElementById("searchInput")?.value || "";
        const category = document.getElementById("categoryFilter")?.value || "";
        const sort = document.getElementById("sortFilter")?.value || "newest";

        // Query storage engine via DataService
        let products = DataService.getProducts({ search, category });

        if (sort === "price-low") {
            products.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sort === "price-high") {
            products.sort((a, b) => Number(b.price) - Number(a.price));
        }

        if (!products || products.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px;">
                    <h3>No products found</h3>
                    <p style="margin-top: 8px; color: var(--color-text-muted);">Try selecting a different category or adjusting your search term.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = products.map(product => {
            const seller = DataService.getSellerById(product.sellerId);
            const storeName = seller ? seller.storeName : "Independent Maker";

            return `
                <article class="preview-product-card">
                    <div class="preview-product-image">
                        <span class="product-category">${escapeHTML(product.category || "General")}</span>
                    </div>
                    <div class="preview-product-info">
                        <p style="font-size: 0.78rem; color: var(--color-text-muted);">${escapeHTML(storeName)}</p>
                        <h3>${escapeHTML(product.name)}</h3>
                        <strong>${formatCurrency(product.price)}</strong>
                        <div style="margin-top: 14px;">
                            <a href="product.html?id=${product.id}" class="btn btn-secondary" style="font-size: 0.8rem; width: 100%; text-align: center;">View Details</a>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    MarketplacePage.init();
});