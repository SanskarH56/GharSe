
/**
 * ARTISAN MARKETPLACE
 * Seller Dashboard Script
 */

const SellerDashboard = {

    init() {
        const user = SessionManager.getUser();
        if (!user || user.role !== "seller") {
            window.location.href = "../auth/login.html";
            return;
        }

        const seller = DataService.getSellerByUserId(user.id);
        if (!seller) return;

        this.renderMetrics(seller.id);
        this.renderRecentOrders(seller.id);
    },

    renderMetrics(sellerId) {
        const products = DataService.getProductsBySeller(sellerId);
        const orderItems = StorageEngine.get("artisan_order_items", []).filter(item => item.sellerId === sellerId);

        let totalRevenue = 0;
        let totalUnits = 0;

        orderItems.forEach(item => {
            totalRevenue += Number(item.subtotal || 0);
            totalUnits += Number(item.quantity || 0);
        });

        const revEl = document.getElementById("metricRevenue");
        const unitsEl = document.getElementById("metricUnits");
        const countEl = document.getElementById("metricProducts");

        if (revEl) revEl.textContent = formatCurrency(totalRevenue);
        if (unitsEl) unitsEl.textContent = totalUnits;
        if (countEl) countEl.textContent = products.length;
    },

    renderRecentOrders(sellerId) {
        const container = document.getElementById("recentOrdersContainer");
        if (!container) return;

        const orderItems = StorageEngine.get("artisan_order_items", []).filter(item => item.sellerId === sellerId);

        if (orderItems.length === 0) {
            container.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">No sales recorded yet.</td></tr>`;
            return;
        }

        const recent = orderItems.slice(-5).reverse();
        container.innerHTML = recent.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid var(--color-border);">${escapeHTML(item.orderId)}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--color-border);">${escapeHTML(item.productName)}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--color-border);">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--color-border);"><strong>${formatCurrency(item.subtotal)}</strong></td>
            </tr>
        `).join("");
    }
};

document.addEventListener("DOMContentLoaded", () => SellerDashboard.init());
