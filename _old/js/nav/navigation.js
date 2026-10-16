
/**
 * ARTISAN MARKETPLACE
 * Unified Navigation Renderer
 *
 * Renders the correct nav (guest / buyer / seller) into any page's
 * <header class="site-header"> based on the current session, then
 * removes whichever link points at the current page.
 *
 * Depends on: utils.js, storage.js, session.js (must load first).
 * auth.js is only needed for the Logout button's onclick, which is
 * already loaded on every page that includes this script.
 */

const NavigationRenderer = {

    /**
     * Figure out how many "../" segments are needed to get back to the
     * project root from the current page, so generated links work no
     * matter how deep the page is nested.
     */
    getRootPrefix() {
        const path = window.location.pathname;
        if (path.includes("/pages/auth/") ||
            path.includes("/pages/seller/") ||
            path.includes("/pages/buyer/") ||
            path.includes("/pages/marketplace/")) {
            return "../../";
        }
        if (path.includes("/pages/")) {
            return "../";
        }
        return "";
    },

    /**
     * Filename of the current page, used to hide the matching nav link.
     */
    getCurrentFile() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf("/") + 1) || "index.html";
    },

    guestLinks(root) {
        return `
            <a href="${root}index.html" class="nav-link">Home</a>
            <a href="${root}pages/marketplace/marketplace.html" class="nav-link">Explore</a>
            <a href="${root}pages/auth/login.html" class="nav-link">Login</a>
            <a href="${root}pages/auth/signup.html?role=seller" class="btn btn-primary nav-cta">Start Selling</a>
            <a href="${root}pages/auth/signup.html?role=buyer" class="btn btn-secondary nav-cta">Become a Buyer</a>
        `;
    },

    buyerLinks(root, user) {
        const summary = (typeof CartEngine !== "undefined") ? CartEngine.getSummary() : { itemCount: 0 };
        return `
            <span class="nav-greeting">Hi, ${escapeHTML(user.name || "there")}</span>
            <a href="${root}index.html" class="nav-link">Home</a>
            <a href="${root}pages/marketplace/marketplace.html" class="nav-link">Explore</a>
            <a href="${root}pages/marketplace/cart.html" class="nav-link nav-cart">
                Cart <span class="cart-badge" id="cartCount">${summary.itemCount}</span>
            </a>
            <div class="nav-profile-dropdown">
                <button class="nav-link nav-profile-trigger" id="navProfileTrigger" type="button">Profile</button>
                <div class="nav-profile-menu" id="navProfileMenu">
                    <a href="${root}pages/buyer/profile.html" class="nav-profile-link">View Profile</a>
                    <a href="${root}pages/buyer/orders.html" class="nav-profile-link">My Orders</a>
                    <hr>
                    <button class="nav-profile-link" onclick="AuthController.logout()" type="button">Logout</button>
                </div>
            </div>
        `;
    },

    sellerLinks(root, user) {
        return `
            <span class="nav-greeting">Hi, ${escapeHTML(user.name || "there")}</span>
            <a href="${root}index.html" class="nav-link">Home</a>
            <a href="${root}pages/seller/dashboard.html" class="nav-link">Dashboard</a>
            <a href="${root}pages/seller/products.html" class="nav-link">Products</a>
            <a href="${root}pages/seller/analytics.html" class="nav-link">Analytics</a>
            <a href="${root}pages/seller/reports.html" class="nav-link">Reports</a>
            <div class="nav-profile-dropdown">
                <button class="nav-link nav-profile-trigger" id="navProfileTrigger" type="button">Profile</button>
                <div class="nav-profile-menu" id="navProfileMenu">
                    <hr>
                    <button class="nav-profile-link" onclick="AuthController.logout()" type="button">Logout</button>
                </div>
            </div>
        `;
    },

    /**
     * Remove any nav link/button whose href points at the current page.
     * Compares just the filename so relative-depth differences don't matter.
     */
    hideCurrentPageLink(navEl) {
        const currentFile = this.getCurrentFile();
        navEl.querySelectorAll("a[href]").forEach(link => {
            const href = link.getAttribute("href");
            const file = href.split("/").pop().split("?")[0];
            if (file === currentFile) {
                link.style.display = "none";
            }
        });
    },

    setupProfileDropdown(navEl) {
        const trigger = navEl.querySelector("#navProfileTrigger");
        const menu = navEl.querySelector("#navProfileMenu");
        if (!trigger || !menu) return;

        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("open");
        });

        document.addEventListener("click", () => menu.classList.remove("open"));
    },

    render() {
        const navEl = document.querySelector(".main-nav");
        if (!navEl) return;

        const root = this.getRootPrefix();
        const user = (typeof SessionManager !== "undefined") ? SessionManager.getUser() : null;

        if (!user) {
            navEl.innerHTML = this.guestLinks(root);
        } else if (user.role === "seller") {
            navEl.innerHTML = this.sellerLinks(root, user);
        } else {
            navEl.innerHTML = this.buyerLinks(root, user);
        }

        this.hideCurrentPageLink(navEl);
        this.setupProfileDropdown(navEl);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    NavigationRenderer.render();
});
