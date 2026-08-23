/**
 * ARTISAN MARKETPLACE
 * Shopping Cart Engine
 */

const CartEngine = {
    STORAGE_KEY: "artisan_cart",

    /**
     * Get current cart array.
     */
    getCart() {
        return StorageEngine.get(this.STORAGE_KEY, []);
    },

    /**
     * Add a product to cart or increment quantity if exists.
     */
    addItem(productId, quantity = 1) {
        const cart = this.getCart();
        const existingIndex = cart.findIndex(item => item.productId === productId);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }

        StorageEngine.set(this.STORAGE_KEY, cart);
        return cart;
    },

    /**
     * Update quantity of a specific item.
     */
    updateQuantity(productId, quantity) {
        let cart = this.getCart();
        if (quantity <= 0) {
            return this.removeItem(productId);
        }

        const item = cart.find(i => i.productId === productId);
        if (item) {
            item.quantity = quantity;
            StorageEngine.set(this.STORAGE_KEY, cart);
        }
        return cart;
    },

    /**
     * Remove item from cart.
     */
    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.productId !== productId);
        StorageEngine.set(this.STORAGE_KEY, cart);
        return cart;
    },

    /**
     * Clear all items from cart.
     */
    clearCart() {
        return StorageEngine.remove(this.STORAGE_KEY);
    },

    /**
     * Get cart item count and totals.
     */
    getSummary() {
        const cart = this.getCart();
        let itemCount = 0;
        let subtotal = 0;

        const itemsDetailed = cart.map(item => {
            const product = DataService.getProductById(item.productId);
            if (!product) return null;

            const lineTotal = product.price * item.quantity;
            itemCount += item.quantity;
            subtotal += lineTotal;

            return {
                ...item,
                product,
                lineTotal
            };
        }).filter(Boolean);

        return {
            items: itemsDetailed,
            itemCount,
            subtotal
        };
    }
};