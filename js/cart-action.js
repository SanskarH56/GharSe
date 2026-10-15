/**
 * GharSe - the one "Add to cart" entry point used by the marketplace and
 * product pages.
 *
 * Who may buy is decided here (guest -> log in, seller/admin -> blocked) and the
 * server enforces it again. The cart itself lives on the backend. Until the cart
 * module exists there is no CartService, so a buyer sees an honest "not
 * available yet" message instead of a fake local cart.
 *
 * When CartService is added it only needs addItem(productId, quantity). A 409
 * from the single-seller lock (FR11) will be handled in the catch block below.
 *
 * Needs: js/auth.js, js/toast.js.
 */
async function handleAddToCart(productId, quantity) {
    if (!Auth.isLoggedIn()) {
        showLoginPrompt("guest");
        return false;
    }

    var role = Auth.getRole();
    if (role === "SELLER") {
        showLoginPrompt("seller");
        return false;
    }
    if (role === "ADMIN") {
        showToast("Admin accounts can't purchase items.", "error");
        return false;
    }

    if (typeof CartService === "undefined") {
        showToast("The cart isn't available yet. It's coming soon.", "info");
        return false;
    }

    try {
        await CartService.addItem(productId, quantity || 1);
        showToast("Added to cart.", "success");
        return true;
    } catch (error) {
        showToast(error.message, "error");
        return false;
    }
}