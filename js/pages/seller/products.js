document.addEventListener("DOMContentLoaded", () => {
    const user = SessionManager.getUser();
    if (!user || user.role !== "seller") {
        window.location.href = "../auth/login.html";
        return;
    }

    const seller = DataService.getSellerByUserId(user.id);
    if (!seller) return;

    function render() {
        const products = DataService.getProductsBySeller(seller.id);
        const container = document.getElementById("sellerProductsContainer");

        if (products.length === 0) {
            container.innerHTML = `<p style="grid-column: 1 / -1;">No products found for your store.</p>`;
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="metric-card">
                <span class="badge badge-success">${escapeHTML(product.category)}</span>
                <h4 style="margin-top: 10px;">${escapeHTML(product.name)}</h4>
                <strong style="color: var(--color-primary);">${formatCurrency(product.price)}</strong>
                <div style="margin-top: 14px; display: flex; gap: 8px;">
                    <a href="product-form.html?id=${product.id}" class="btn btn-secondary" style="flex: 1; padding: 6px; text-align: center;">Edit</a>
                    <button class="btn btn-secondary" style="flex: 1; padding: 6px; color: var(--color-error);" onclick="deleteItem('${product.id}')">Delete</button>
                </div>
            </div>
        `).join("");
    }

    window.deleteItem = function(id) {
        if (confirm("Are you sure you want to remove this product?")) {
            DataService.deleteProduct(id, seller.id);
            render();
        }
    };

    render();
});