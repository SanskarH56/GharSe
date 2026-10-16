document.addEventListener("DOMContentLoaded", () => {
    const sellers = StorageEngine.get("artisan_seller_profiles", []) || [];
    const products = StorageEngine.get("artisan_products", []) || [];
    const orders = StorageEngine.get("artisan_orders", []) || [];
    const orderItems = StorageEngine.get("artisan_order_items", []) || [];
    const transactions = StorageEngine.get("artisan_transactions", []) || [];

    // 1. Key Metrics
    document.getElementById("trendsSellers").textContent = sellers.length;
    document.getElementById("trendsProducts").textContent = products.length;
    document.getElementById("trendsOrders").textContent = orders.length;
    
    const totalValue = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    document.getElementById("trendsValue").textContent = formatCurrency(totalValue);

    // 2. Trending Products (by units sold)
    const productSales = {};
    orderItems.forEach(item => {
        if (!productSales[item.productId]) {
            productSales[item.productId] = { name: item.productName, units: 0, revenue: 0 };
        }
        productSales[item.productId].units += Number(item.quantity) || 0;
        productSales[item.productId].revenue += Number(item.subtotal) || 0;
    });

    const topProducts = Object.values(productSales)
        .sort((a, b) => b.units - a.units)
        .slice(0, 5);

    const trendsProductsList = document.getElementById("trendsProductsList");
    if (topProducts.length === 0) {
        trendsProductsList.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); padding: 20px;">No sales data yet</p>`;
    } else {
        trendsProductsList.innerHTML = topProducts.map((p, i) => `
            <div style="padding: 8px 0; border-bottom: 1px solid var(--color-border);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <span style="font-weight: 500;">${i + 1}. ${escapeHTML(p.name)}</span>
                    <span style="color: var(--color-primary); font-weight: 600;">${p.units} sold</span>
                </div>
                <p style="margin-top: 2px; color: var(--color-text-muted); font-size: 0.85rem;">Revenue: ${formatCurrency(p.revenue)}</p>
            </div>
        `).join("");
    }

    // 3. Top Categories
    const categorySales = {};
    orderItems.forEach(item => {
        const cat = item.category || "Uncategorized";
        if (!categorySales[cat]) categorySales[cat] = 0;
        categorySales[cat] += Number(item.subtotal) || 0;
    });

    const topCategories = Object.entries(categorySales)
        .map(([cat, revenue]) => ({ name: cat, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    const trendsCategoriesList = document.getElementById("trendsCategoriesList");
    if (topCategories.length === 0) {
        trendsCategoriesList.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); padding: 20px;">No sales data yet</p>`;
    } else {
        trendsCategoriesList.innerHTML = topCategories.map(c => `
            <div style="padding: 8px 0; border-bottom: 1px solid var(--color-border);">
                <div style="display: flex; justify-content: space-between;">
                    <span>${escapeHTML(c.name)}</span>
                    <strong>${formatCurrency(c.revenue)}</strong>
                </div>
            </div>
        `).join("");
    }

    // 4. Popular Sellers (by product count)
    const sellerProductCount = {};
    products.forEach(p => {
        if (!sellerProductCount[p.sellerId]) {
            sellerProductCount[p.sellerId] = 0;
        }
        sellerProductCount[p.sellerId]++;
    });

    const topSellers = sellers
        .map(s => ({
            ...s,
            productCount: sellerProductCount[s.id] || 0,
            sales: orderItems.filter(i => i.sellerId === s.id).reduce((sum, i) => sum + (Number(i.subtotal) || 0), 0)
        }))
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, 5);

    const trendsSellersList = document.getElementById("trendsSellersList");
    if (topSellers.length === 0) {
        trendsSellersList.innerHTML = `<p style="text-align: center; color: var(--color-text-muted); padding: 20px;">No sellers yet</p>`;
    } else {
        trendsSellersList.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                ${topSellers.map(s => `
                    <a href="seller-store.html?id=${s.id}" style="text-decoration: none;">
                        <div class="metric-card" style="height: 100%; transition: transform 0.2s;">
                            <h4 style="margin-bottom: 8px; font-size: 0.95rem;">${escapeHTML(s.storeName)}</h4>
                            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 8px;">${s.productCount} product${s.productCount !== 1 ? 's' : ''}</p>
                            <p style="font-size: 0.85rem; color: var(--color-primary); font-weight: 600;">Revenue: ${formatCurrency(s.sales)}</p>${s.bio ? `<p style="font-size: 0.8rem; margin-top: 8px; color: var(--color-text-muted); line-height: 1.3;">${escapeHTML(s.bio)}</p>` : ''}
                        </div>
                    </a>
                `).join("")}
            </div>
        `;
    }
});