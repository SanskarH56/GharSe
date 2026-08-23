/**
 * ARTISAN MARKETPLACE
 * Reports Engine
 */

const ReportEngine = {

    getFilteredOrders(sellerId, startDate, endDate) {
        const orderItems = StorageEngine.get("artisan_order_items", []).filter(i => i.sellerId === sellerId);
        const orders = StorageEngine.get("artisan_orders", []);

        return orderItems.filter(item => {
            const parentOrder = orders.find(o => o.id === item.orderId);
            if (!parentOrder) return false;
            
            const orderDate = new Date(parentOrder.createdAt);
            if (startDate && orderDate < new Date(startDate)) return false;
            if (endDate && orderDate > new Date(endDate + "T23:59:59")) return false;

            return true;
        }).map(item => {
            const parentOrder = orders.find(o => o.id === item.orderId);
            return {
                orderId: item.orderId,
                date: new Date(parentOrder.createdAt).toLocaleDateString(),
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.price,
                subtotal: item.subtotal,
                paymentMethod: parentOrder.paymentMethod || "Simulated Card"
            };
        });
    }
};