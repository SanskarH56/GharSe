document.addEventListener("DOMContentLoaded", () => {
    const user = SessionManager.getUser();
    if (!user) {
        window.location.href = "../auth/login.html";
        return;
    }
    if (user.role !== "buyer") {
        window.location.href = "marketplace.html";
        return;
    }

    const summary = CartEngine.getSummary();
    const summaryContainer = document.getElementById("checkoutSummaryItems");
    const totalEl = document.getElementById("checkoutTotal");

    if (!summary.items || summary.items.length === 0) {
        window.location.href = "cart.html";
        return;
    }

    totalEl.textContent = formatCurrency(summary.subtotal);
    summaryContainer.innerHTML = summary.items.map(item => `
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 8px;">
            <span>${escapeHTML(item.product.name)} (x${item.quantity})</span>
            <strong>${formatCurrency(item.lineTotal)}</strong>
        </div>
    `).join("");

    document.getElementById("checkoutForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const shippingDetails = {
            address: document.getElementById("address").value,
            city: document.getElementById("city").value,
            pincode: document.getElementById("pincode").value
        };
        const paymentMethod = document.getElementById("paymentMethod").value;

        const result = OrderEngine.createOrder(shippingDetails, paymentMethod);

        if (result.success) {
            const wrapper = document.getElementById("checkoutWrapper");
            wrapper.innerHTML = `
                <div class="metric-card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <span class="badge badge-success" style="font-size: 1rem; padding: 6px 16px;">Payment Successful</span>
                    <h2 style="margin-top: 16px;">Order #${result.orderId} Confirmed!</h2>
                    <p style="margin-top: 8px; color: var(--color-text-muted);">Thank you for supporting independent women artisans.</p>
                    <a href="marketplace.html" class="btn btn-primary" style="margin-top: 24px;">Back to Marketplace</a>
                </div>
            `;
        } else {
            showToast(result.message || "Something went wrong placing your order. Please try again.", "error");
            if (!SessionManager.getUser()) {
                window.location.href = "../auth/login.html";
            }
        }
    });
});