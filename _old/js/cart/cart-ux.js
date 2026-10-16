
/**
 * ARTISAN MARKETPLACE
 * Cart UX Helpers — toast notifications + login/role prompt modal
 *
 * Depends on: utils.js (escapeHTML), the .modal-backdrop / .modal-content
 * / .toast-stack CSS already defined in components.css.
 */

function showToast(message, type = "info") {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
        stack = document.createElement("div");
        stack.className = "toast-stack";
        document.body.appendChild(stack);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    stack.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 250);
    }, 3500);
}

/**
 * Shows a blocking modal explaining why Add to Cart isn't available.
 * reason: "guest" | "seller"
 */
function showLoginPrompt(reason) {
    let backdrop = document.getElementById("cartBlockModal");
    if (backdrop) backdrop.remove();

    const rootPrefix = (typeof NavigationRenderer !== "undefined")
        ? NavigationRenderer.getRootPrefix()
        : "../../";

    const isGuest = reason === "guest";

    const title = isGuest ? "Log in to shop" : "Switch to a buyer account";
    const message = isGuest
        ? "Create a buyer account or log in to add items to your cart and checkout."
        : "Seller accounts can't purchase items. Log out and create or use a buyer account to shop.";

    const actionsHTML = isGuest
        ? `
            <a href="${rootPrefix}pages/auth/signup.html?role=buyer" class="btn btn-primary">Create Buyer Account</a>
            <a href="${rootPrefix}pages/auth/login.html" class="btn btn-secondary">Log In</a>
        `
        : `
            <button class="btn btn-primary" type="button" onclick="AuthController.logout()">Log Out</button>
            <a href="${rootPrefix}pages/auth/signup.html?role=buyer" class="btn btn-secondary">Create Buyer Account</a>
        `;

    backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.id = "cartBlockModal";
    backdrop.innerHTML = `
        <div class="modal-content" style="text-align: center;">
            <h3 style="font-size: 1.4rem; margin-bottom: 10px;">${escapeHTML(title)}</h3>
            <p style="color: var(--color-text-secondary); margin-bottom: 24px; line-height: 1.6;">${escapeHTML(message)}</p>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                ${actionsHTML}
            </div>
        </div>
    `;

    backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) backdrop.remove();
    });

    document.body.appendChild(backdrop);
    requestAnimationFrame(() => backdrop.classList.add("active"));
}
