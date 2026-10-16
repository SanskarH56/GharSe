
/**
 * ARTISAN MARKETPLACE
 * Centralized Application Data Service Layer
 */

const DataService = {

    // =========================================
    // PRODUCTS
    // =========================================

    /**
     * Get all active products with optional category or search filter.
     */
    getProducts(filters = {}) {
        let products = StorageEngine.get("artisan_products", []);

        if (filters.category) {
            products = products.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
        }

        if (filters.search) {
            const query = filters.search.toLowerCase();
            products = products.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category.toLowerCase().includes(query)
            );
        }

        return products;
    },

    /**
     * Get a single product by ID.
     */
    getProductById(productId) {
        const products = StorageEngine.get("artisan_products", []);
        return products.find(p => p.id === productId) || null;
    },

    /**
     * Get all products belonging to a specific seller.
     */
    getProductsBySeller(sellerId) {
        const products = StorageEngine.get("artisan_products", []);
        return products.filter(p => p.sellerId === sellerId);
    },

    // =========================================
    // SELLERS & BUYERS
    // =========================================

    /**
     * Get seller profile by seller ID.
     */
    getSellerById(sellerId) {
        const sellers = StorageEngine.get("artisan_seller_profiles", []);
        return sellers.find(s => s.id === sellerId) || null;
    },

    // =========================================
    // ORDERS & TRANSACTIONS
    // =========================================

    /**
     * Get order items associated with a specific seller (for seller analytics/orders).
     */
    getOrderItemsBySeller(sellerId) {
        const orderItems = StorageEngine.get("artisan_order_items", []);
        return orderItems.filter(item => item.sellerId === sellerId);
    }
};

/**
 * ARTISAN MARKETPLACE
 * Extended Data Service Abstraction Layer
 */

// Add/ensure these methods exist in DataService object:
DataService.getOrdersByBuyer = function(buyerId) {
    const orders = StorageEngine.get("artisan_orders", []);
    return orders.filter(o => o.buyerId === buyerId);
};

DataService.getOrdersBySeller = function(sellerId) {
    const orderItems = StorageEngine.get("artisan_order_items", []);
    const sellerItems = orderItems.filter(item => item.sellerId === sellerId);
    const orderIds = [...new Set(sellerItems.map(item => item.orderId))];
    const orders = StorageEngine.get("artisan_orders", []);
    return orders.filter(o => orderIds.includes(o.id));
};

DataService.getSellerByUserId = function(userId) {
    const sellers = StorageEngine.get("artisan_seller_profiles", []);
    return sellers.find(s => s.userId === userId);
};

DataService.getBuyerByUserId = function(userId) {
    const buyers = StorageEngine.get("artisan_buyer_profiles", []);
    return buyers.find(b => b.userId === userId);
};

DataService.createProduct = function(productData) {
    const products = StorageEngine.get("artisan_products", []);
    const newProduct = {
        id: generateId("prd"),
        ...productData,
        createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    StorageEngine.set("artisan_products", products);
    return newProduct;
};

DataService.deleteProduct = function(productId, sellerId) {
    let products = StorageEngine.get("artisan_products", []);
    const target = products.find(p => p.id === productId);

    // If a sellerId is supplied, only allow deleting products owned by that seller.
    if (sellerId && target && target.sellerId !== sellerId) {
        return false;
    }

    products = products.filter(p => p.id !== productId);
    StorageEngine.set("artisan_products", products);
    return true;
};
