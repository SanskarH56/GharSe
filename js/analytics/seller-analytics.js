
/**
 * ARTISAN MARKETPLACE
 * Seller Analytics Calculation Engine
 */

const SellerAnalytics = {

    getAnalyticsData(sellerId) {
        const orderItems = StorageEngine.get("artisan_order_items", []).filter(item => item.sellerId === sellerId);
        
        // 1. Calculate Summary Totals
        let totalRevenue = 0;
        let totalUnits = 0;
        const productSalesMap = {};
        const categorySalesMap = {};

        orderItems.forEach(item => {
            const subtotal = Number(item.subtotal || 0);
            const qty = Number(item.quantity || 0);

            totalRevenue += subtotal;
            totalUnits += qty;

            // Product performance breakdown — keyed by productId so two
            // products that happen to share a name never merge, and a
            // renamed/deleted product still reports correctly under its
            // original name at time of sale.
            const key = item.productId || item.productName;
            if (!productSalesMap[key]) {
                productSalesMap[key] = { name: item.productName, units: 0, revenue: 0 };
            }
            productSalesMap[key].units += qty;
            productSalesMap[key].revenue += subtotal;

            // Category performance — built directly from the order item's
            // own snapshotted category (falls back to a current product
            // lookup for historical items created before category snapshots
            // were recorded), so this never drops revenue for a product
            // that's since been deleted or recategorized.
            let cat = item.category;
            if (!cat) {
                const product = DataService.getProductById(item.productId);
                cat = (product && product.category) || "Uncategorized";
            }
            if (!categorySalesMap[cat]) categorySalesMap[cat] = 0;
            categorySalesMap[cat] += subtotal;
        });

        const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue);

        return {
            totalRevenue,
            totalUnits,
            orderCount: new Set(orderItems.map(i => i.orderId)).size,
            topProducts,
            categorySalesMap
        };
    },

    renderDashboard(sellerId) {
        const data = this.getAnalyticsData(sellerId);

        const revEl = document.getElementById("analyticsRevenue");
        const unitsEl = document.getElementById("analyticsUnits");
        const ordersEl = document.getElementById("analyticsOrders");

        if (revEl) revEl.textContent = formatCurrency(data.totalRevenue);
        if (unitsEl) unitsEl.textContent = data.totalUnits;
        if (ordersEl) ordersEl.textContent = data.orderCount;

        // Render Top Products Table
        const topTable = document.getElementById("topProductsContainer");
        if (topTable) {
            if (data.topProducts.length === 0) {
                topTable.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 20px;">No transaction data recorded yet.</td></tr>`;
            } else {
                topTable.innerHTML = data.topProducts.map(p => `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid var(--color-border);">${escapeHTML(p.name)}</td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--color-border);">${p.units}</td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--color-border);"><strong>${formatCurrency(p.revenue)}</strong></td>
                    </tr>
                `).join("");
            }
        }

        // Render Category Performance
        const catContainer = document.getElementById("categoryPerformanceContainer");
        if (catContainer) {
            const categories = Object.keys(data.categorySalesMap);
            if (categories.length === 0) {
                catContainer.innerHTML = `<p style="padding: 15px;">No sales by category yet.</p>`;
            } else {
                catContainer.innerHTML = categories.map(cat => `
                    <div style="margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 4px;">
                            <span>${escapeHTML(cat)}</span>
                            <strong>${formatCurrency(data.categorySalesMap[cat])}</strong>
                        </div>
                    </div>
                `).join("");
            }
        }
    }
}
