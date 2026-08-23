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

    /**
     * Save or update a product.
     */
    saveProduct(productData) {
        const products = StorageEngine.get("artisan_products", []);
        const existingIndex = products.findIndex(p => p.id === productData.id);

        if (existingIndex >= 0) {
            products[existingIndex] = { ...products[existingIndex], ...productData };
        } else {
            productData.id = productData.id || generateId("prod");
            products.push(productData);
        }

        StorageEngine.set("artisan_products", products);
        return productData;
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

    /**
     * Get seller profile by User ID.
     */
    getSellerByUserId(userId) {
        const sellers = StorageEngine.get("artisan_seller_profiles", []);
        return sellers.find(s => s.userId === userId) || null;
    },

    // =========================================
    // ORDERS & TRANSACTIONS
    // =========================================

    /**
     * Process an order creation with order items snapshot.
     */
    createOrder(buyerId, cartItems, shippingDetails, paymentMethod) {
        const orders = StorageEngine.get("artisan_orders", []);
        const orderItems = StorageEngine.get("artisan_order_items", []);
        const transactions = StorageEngine.get("artisan_transactions", []);

        const orderId = generateId("ord");
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // 1. Create Order Root
        const newOrder = {
            id: orderId,
            buyerId,
            totalAmount,
            status: "Completed",
            shippingAddress: shippingDetails.address,
            createdAt: new Date().toISOString()
        };

        // 2. Snapshot Order Items
        const newItems = cartItems.map(item => ({
            id: generateId("item"),
            orderId,
            productId: item.productId,
            sellerId: item.sellerId,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        }));

        // 3. Record Transaction
        const newTransaction = {
            id: generateId("txn"),
            orderId,
            buyerId,
            amount: totalAmount,
            paymentMethod,
            status: "Success",
            createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        orderItems.push(...newItems);
        transactions.push(newTransaction);

        StorageEngine.set("artisan_orders", orders);
        StorageEngine.set("artisan_order_items", orderItems);
        StorageEngine.set("artisan_transactions", transactions);

        return { order: newOrder, items: newItems, transaction: newTransaction };
    },

    /**
     * Get orders for a specific buyer.
     */
    getOrdersByBuyer(buyerId) {
        const orders = StorageEngine.get("artisan_orders", []);
        return orders.filter(o => o.buyerId === buyerId);
    },

    /**
     * Get order items associated with a specific seller (for seller analytics/orders).
     */
    getOrderItemsBySeller(sellerId) {
        const orderItems = StorageEngine.get("artisan_order_items", []);
        return orderItems.filter(item => item.sellerId === sellerId);
    }
};