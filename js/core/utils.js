/**
 * ARTISAN MARKETPLACE
 * Utility Functions
 */


/**
 * Safely parse JSON.
 */
function parseJSON(value, fallback = null) {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}


/**
 * Generate a simple unique ID.
 */
function generateId(prefix = "id") {
    return `${prefix}_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;
}


/**
 * Format Indian currency.
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(amount);
}


/**
 * Escape HTML before inserting user-generated content.
 */
function escapeHTML(value) {
    const element = document.createElement("div");

    element.textContent = value ?? "";

    return element.innerHTML;
}