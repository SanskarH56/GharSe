document.addEventListener("DOMContentLoaded", () => {
    const user = SessionManager.getUser();
    if (!user) {
        window.location.href = "../auth/login.html";
        return;
    }
    if (user.role !== "buyer") {
        window.location.href = "../seller/dashboard.html";
        return;
    }

    const orders = StorageEngine.get("artisan_orders", []).filter(o => o.buyerId === user.id);
    const allItems = StorageEngine.get("artisan_order_items", []);
    const container = document.getElementById("buyerOrdersContainer");

    function renderOrders(filterText) {
        let filtered = orders;
        if (filterText && filterText.trim()) {
            const needle = filterText.trim().toLowerCase();
            filtered = orders.filter(o => o.id.toLowerCase().includes(needle));
        }

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="metric-card" style="text-align: center; padding: 40px;">
                    <p>You haven't placed any orders yet.</p>
                    <a href="../marketplace/marketplace.html" class="btn btn-primary" style="margin-top: 14px;">Explore Marketplace</a>
                </div>
            `;
            return;
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="metric-card" style="text-align: center; padding: 40px;">
                    <p>No orders match "${escapeHTML(filterText)}".</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.slice().reverse().map(order => {
            const items = allItems.filter(item => item.orderId === order.id);
            
            return `
                <div class="metric-card" style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; margin-bottom: 12px;">
                        <div>
                            <strong>Order #${escapeHTML(order.id)}</strong>
                            <p style="font-size: 0.82rem; color: var(--color-text-muted);">${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style="text-align: right;">
                            <span class="badge badge-success">${escapeHTML(order.status || 'Completed')}</span>
                            <p style="font-weight: 700; color: var(--color-primary); margin-top: 4px;">${formatCurrency(order.totalAmount)}</p>
                        </div>
                    </div>

                    <div>
                        ${items.map(item => `
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; padding: 6px 0;">
                                <span>${escapeHTML(item.productName)} (x${item.quantity})</span>
                                <strong>${formatCurrency(item.subtotal)}</strong>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--color-border); font-size: 0.82rem; color: var(--color-text-muted);">
                        <p>Shipped to: ${escapeHTML(order.shippingAddress || '—')}${order.city ? ', ' + escapeHTML(order.city) : ''}${order.pincode ? ' ' + escapeHTML(order.pincode) : ''}</p>
                        ${order.paymentMethod ? `<p style="margin-top: 2px;">Paid via: ${escapeHTML(order.paymentMethod)}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderOrders("");

    document.getElementById("orderSearch").addEventListener("input", (e) => {
        renderOrders(e.target.value);
    });
});document.addEventListener("DOMContentLoaded", () => {
    const user = SessionManager.getUser();
    if (!user) {
        window.location.href = "../auth/login.html";
        return;
    }
    if (user.role !== "buyer") {
        window.location.href = "../seller/dashboard.html";
        return;
    }

    const orders = StorageEngine.get("artisan_orders", []).filter(o => o.buyerId === user.id);
    const allItems = StorageEngine.get("artisan_order_items", []);
    const container = document.getElementById("buyerOrdersContainer");

    function renderOrders(filterText) {
        let filtered = orders;
        if (filterText && filterText.trim()) {
            const needle = filterText.trim().toLowerCase();
            filtered = orders.filter(o => o.id.toLowerCase().includes(needle));
        }

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="metric-card" style="text-align: center; padding: 40px;">
                    <p>You haven't placed any orders yet.</p>
                    <a href="../marketplace/marketplace.html" class="btn btn-primary" style="margin-top: 14px;">Explore Marketplace</a>
                </div>
            `;
            return;
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="metric-card" style="text-align: center; padding: 40px;">
                    <p>No orders match "${escapeHTML(filterText)}".</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.slice().reverse().map(order => {
            const items = allItems.filter(item => item.orderId === order.id);
            
            return `
                <div class="metric-card" style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; margin-bottom: 12px;">
                        <div>
                            <strong>Order #${escapeHTML(order.id)}</strong>
                            <p style="font-size: 0.82rem; color: var(--color-text-muted);">${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style="text-align: right;">
                            <span class="badge badge-success">${escapeHTML(order.status || 'Completed')}</span>
                            <p style="font-weight: 700; color: var(--color-primary); margin-top: 4px;">${formatCurrency(order.totalAmount)}</p>
                        </div>
                    </div>

                    <div>
                        ${items.map(item => `
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; padding: 6px 0;">
                                <span>${escapeHTML(item.productName)} (x${item.quantity})</span>
                                <strong>${formatCurrency(item.subtotal)}</strong>
                            </div>
                        `).join('')}
                    </div>

                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--color-border); font-size: 0.82rem; color: var(--color-text-muted);">
                        <p>Shipped to: ${escapeHTML(order.shippingAddress || '—')}${order.city ? ', ' + escapeHTML(order.city) : ''}${order.pincode ? ' ' + escapeHTML(order.pincode) : ''}</p>
                        ${order.paymentMethod ? `<p style="margin-top: 2px;">Paid via: ${escapeHTML(order.paymentMethod)}</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderOrders("");

    document.getElementById("orderSearch").addEventListener("input", (e) => {
        renderOrders(e.target.value);
    });
});