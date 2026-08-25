
/**
 * ARTISAN MARKETPLACE
 * Orders & Transactions Controller
 */

const OrderEngine = {

    /**
     * Process checkout cart items and generate order/transaction entries.
     */
    createOrder(shippingDetails, paymentMethod) {
        const cartSummary = CartEngine.getSummary();
        if (!cartSummary.items || cartSummary.items.length === 0) {
            return { success: false, message: "Cart is empty." };
        }

        const currentUser = SessionManager.getUser();
        if (!currentUser) {
            return { success: false, message: "You must be logged in to place an order." };
        }
        const buyerId = currentUser.id;

        const orderId = generateId("ord");
        const transactionId = generateId("txn");
        const timestamp = new Date().toISOString();

        // 1. Create main Order record
        const orders = StorageEngine.get("artisan_orders", []);
        const newOrder = {
            id: orderId,
            buyerId: buyerId,
            totalAmount: cartSummary.subtotal,
            status: "Completed",
            shippingAddress: shippingDetails.address,
            city: shippingDetails.city || "Local",
            pincode: shippingDetails.pincode || "",
            paymentMethod: paymentMethod,
            createdAt: timestamp
        };
        orders.push(newOrder);
        StorageEngine.set("artisan_orders", orders);

        // 2. Create OrderItems snapshots
        const orderItems = StorageEngine.get("artisan_order_items", []);
        cartSummary.items.forEach(item => {
            orderItems.push({
                id: generateId("ori"),
                orderId: orderId,
                productId: item.productId,
                sellerId: item.product.sellerId,
                productName: item.product.name,
                category: item.product.category || "Uncategorized",
                price: item.product.price,
                quantity: item.quantity,
                subtotal: item.lineTotal
            });
        });
        StorageEngine.set("artisan_order_items", orderItems);

        // 3. Create Transaction log
        const transactions = StorageEngine.get("artisan_transactions", []);
        transactions.push({
            id: transactionId,
            orderId: orderId,
            buyerId: buyerId,
            amount: cartSummary.subtotal,
            paymentMethod: paymentMethod,
            status: "Success",
            createdAt: timestamp
        });
        StorageEngine.set("artisan_transactions", transactions);

        // 4. Clear shopping cart upon successful checkout
        CartEngine.clearCart();

        return { success: true, orderId: orderId, transactionId: transactionId };
    }
};