
/**
 * ARTISAN MARKETPLACE
 * Shopping Cart Engine
 */

const CartEngine = {
    /**
     * Cart is scoped per logged-in user so different accounts on the
     * same browser never see each other's cart contents. Logged-out
     * visitors share a single anonymous cart key.
     */
    get STORAGE_KEY() {
        const user = (typeof SessionManager !== "undefined") ? SessionManager.getUser() : null;
        return user ? `artisan_cart_${user.id}` : "artisan_cart_guest";
    },

    /**
     * Get current cart array.
     */
    getCart() {
        return StorageEngine.get(this.STORAGE_KEY, []);
    },

    /**
     * Add a product to cart or increment quantity if exists.
     * Quantity is clamped to available stock when the product tracks stock.
     */
    addItem(productId, quantity = 1) {
        const cart = this.getCart();
        const existingIndex = cart.findIndex(item => item.productId === productId);
        const maxQty = this._getMaxQuantity(productId);

        if (existingIndex > -1) {
            let newQty = cart[existingIndex].quantity + quantity;
            if (maxQty !== null) newQty = Math.min(newQty, maxQty);
            cart[existingIndex].quantity = newQty;
        } else {
            let newQty = quantity;
            if (maxQty !== null) newQty = Math.min(newQty, maxQty);
            cart.push({ productId, quantity: newQty });
        }

        StorageEngine.set(this.STORAGE_KEY, cart);
        return cart;
    },

    /**
     * Update quantity of a specific item, clamped to available stock.
     */
    updateQuantity(productId, quantity) {
        let cart = this.getCart();
        if (quantity <= 0) {
            return this.removeItem(productId);
        }

        const maxQty = this._getMaxQuantity(productId);
        const clampedQty = (maxQty !== null) ? Math.min(quantity, maxQty) : quantity;

        const item = cart.find(i => i.productId === productId);
        if (item) {
            item.quantity = clampedQty;
            StorageEngine.set(this.STORAGE_KEY, cart);
        }
        return cart;
    },

    /**
     * Returns the max purchasable quantity for a product based on its
     * tracked stock, or null if the product doesn't track stock.
     */
    _getMaxQuantity(productId) {
        const product = (typeof DataService !== "undefined") ? DataService.getProductById(productId) : null;
        if (!product) return null;
        const stock = parseInt(product.stock, 10);
        return isNaN(stock) ? null : Math.max(stock, 0);
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

/**
 * Update any #cartCount badge(s) in the current page's nav to reflect
 * the real cart item count. Safe to call on pages with no such element.
 */
function updateCartBadge() {
    const summary = CartEngine.getSummary();
    document.querySelectorAll("#cartCount").forEach(el => {
        el.textContent = summary.itemCount;
    });
}
