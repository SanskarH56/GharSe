
/**
 * ARTISAN MARKETPLACE
 * Landing Page
 */

const HomePage = {

    init() {
        this.setupCategoryLinks();
        this.renderTrendingProducts();
    },

    /**
     * Show the top 3-5 products by units sold (derived from order items,
     * same logic as the full trends page). Falls back to newest products
     * if there's no sales history yet, so the section is never empty.
     */
    renderTrendingProducts() {
        const grid = document.getElementById("homeTrendingGrid");
        if (!grid) return;

        const orderItems = StorageEngine.get("artisan_order_items", []) || [];

        const salesByProduct = {};
        orderItems.forEach(item => {
            if (!salesByProduct[item.productId]) {
                salesByProduct[item.productId] = 0;
            }
            salesByProduct[item.productId] += Number(item.quantity) || 0;
        });

        let topProductIds = Object.entries(salesByProduct)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([productId]) => productId);

        let products = topProductIds
            .map(id => DataService.getProductById(id))
            .filter(Boolean);

        // No sales data yet (fresh install) - show newest products instead
        // so the section isn't empty.
        if (products.length === 0) {
            products = DataService.getProducts().slice(0, 5);
        }

        if (products.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 30px;">
                    <p style="color: var(--color-text-muted);">No products yet.</p>
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
                            <a href="pages/marketplace/product.html?id=${product.id}" class="btn btn-secondary" style="font-size: 0.8rem; width: 100%; text-align: center;">View Details</a>
                        </div>
                    </div>
                </article>
            `;
        }).join("");
    },


    setupCategoryLinks() {

        const categoryCards =
            document.querySelectorAll(".category-card");

        categoryCards.forEach(card => {

            card.addEventListener("click", event => {

                event.preventDefault();

                const category =
                    card.querySelector("span:last-child")
                        ?.textContent
                        ?.trim();

                if (!category) {
                    return;
                }

                window.location.href =
                    `pages/marketplace/marketplace.html?category=${encodeURIComponent(category)}`;
            });

        });

    }

};


document.addEventListener("DOMContentLoaded", () => {
    HomePage.init();
});
