document.addEventListener("DOMContentLoaded", () => {
    const user = SessionManager.getUser();
    if (!user || user.role !== "seller") {
        window.location.href = "../auth/login.html";
        return;
    }

    const seller = DataService.getSellerByUserId(user.id);
    if (!seller) return;

    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get("id");

    if (editId) {
        const existing = DataService.getProductById(editId);
        if (!existing || existing.sellerId !== seller.id) {
            // Not found, or belongs to a different seller — do not allow editing.
            window.location.href = "products.html";
            return;
        }
        document.getElementById("formTitle").textContent = "Edit Product";
        document.getElementById("productId").value = existing.id;
        document.getElementById("productName").value = existing.name;
        document.getElementById("category").value = existing.category;
        document.getElementById("price").value = existing.price;
        document.getElementById("stock").value = existing.stock || 10;
        document.getElementById("description").value = existing.description || "";
    }

    document.getElementById("productForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const pId = document.getElementById("productId").value;
        const productData = {
            sellerId: seller.id,
            name: document.getElementById("productName").value,
            category: document.getElementById("category").value,
            price: parseFloat(document.getElementById("price").value),
            stock: parseInt(document.getElementById("stock").value, 10),
            description: document.getElementById("description").value,
            image: `assets/products/default-${document.getElementById("category").value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.jpg`
        };

        if (pId) {
            const products = StorageEngine.get("artisan_products", []);
            const idx = products.findIndex(p => p.id === pId && p.sellerId === seller.id);
            if (idx > -1) {
                products[idx] = { ...products[idx], ...productData };
                StorageEngine.set("artisan_products", products);
            } else {
                alert("You do not have permission to edit this product.");
                return;
            }
        } else {
            DataService.createProduct(productData);
        }

        window.location.href = "products.html";
    });
});