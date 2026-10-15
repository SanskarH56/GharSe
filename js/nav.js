/**
 * GharSe - Navigation renderer (replaces js/nav/navigation.js).
 *
 * Fills <nav class="main-nav"> with the right links for guest, buyer, seller
 * or admin, based on the role in the JWT (Auth.getRole()). The role only picks
 * which links are shown. The backend still enforces access on every request.
 *
 * Needs: js/auth.js loaded first.
 *
 * Notes:
 *  - The "Hi, <name>" greeting is gone. The token carries only the user id and
 *    role, and GET /v1/users/me does not exist yet. Add it back from that
 *    endpoint once it does.
 *  - The cart badge stays hidden until the cart backend exists. Call
 *    Nav.setCartCount(n) when it does.
 */

var Nav = {

    /**
     * How many "../" segments are needed to get back to the project root
     * from the current page. Works wherever the site is hosted.
     */
    getRootPrefix: function () {
        var path = window.location.pathname;
        if (path.indexOf("/pages/auth/") !== -1 ||
            path.indexOf("/pages/seller/") !== -1 ||
            path.indexOf("/pages/buyer/") !== -1 ||
            path.indexOf("/pages/admin/") !== -1 ||
            path.indexOf("/pages/marketplace/") !== -1) {
            return "../../";
        }
        if (path.indexOf("/pages/") !== -1) {
            return "../";
        }
        return "";
    },

    /** Filename of the current page, used to hide the matching nav link. */
    getCurrentFile: function () {
        var path = window.location.pathname;
        return path.substring(path.lastIndexOf("/") + 1) || "index.html";
    },

    guestLinks: function (root) {
        return '' +
            '<a href="' + root + 'index.html" class="nav-link">Home</a>' +
            '<a href="' + root + 'pages/marketplace/marketplace.html" class="nav-link">Explore</a>' +
            '<a href="' + root + 'pages/auth/login.html" class="nav-link">Login</a>' +
            '<a href="' + root + 'pages/auth/signup.html?role=seller" class="btn btn-primary nav-cta">Start Selling</a>' +
            '<a href="' + root + 'pages/auth/signup.html?role=buyer" class="btn btn-secondary nav-cta">Become a Buyer</a>';
    },

    buyerLinks: function (root) {
        return '' +
            '<a href="' + root + 'index.html" class="nav-link">Home</a>' +
            '<a href="' + root + 'pages/marketplace/marketplace.html" class="nav-link">Explore</a>' +
            '<a href="' + root + 'pages/marketplace/cart.html" class="nav-link nav-cart">' +
                'Cart <span class="cart-badge" id="cartCount" style="display: none;">0</span>' +
            '</a>' +
            '<div class="nav-profile-dropdown">' +
                '<button class="nav-link nav-profile-trigger" id="navProfileTrigger" type="button">Profile</button>' +
                '<div class="nav-profile-menu" id="navProfileMenu">' +
                    '<a href="' + root + 'pages/buyer/profile.html" class="nav-profile-link">View Profile</a>' +
                    '<a href="' + root + 'pages/buyer/orders.html" class="nav-profile-link">My Orders</a>' +
                    '<hr>' +
                    '<button class="nav-profile-link" onclick="Auth.logout()" type="button">Logout</button>' +
                '</div>' +
            '</div>';
    },

    sellerLinks: function (root) {
        return '' +
            '<a href="' + root + 'index.html" class="nav-link">Home</a>' +
            '<a href="' + root + 'pages/seller/dashboard.html" class="nav-link">Dashboard</a>' +
            '<a href="' + root + 'pages/seller/products.html" class="nav-link">Products</a>' +
            '<a href="' + root + 'pages/seller/analytics.html" class="nav-link">Analytics</a>' +
            '<a href="' + root + 'pages/seller/reports.html" class="nav-link">Reports</a>' +
            '<div class="nav-profile-dropdown">' +
                '<button class="nav-link nav-profile-trigger" id="navProfileTrigger" type="button">Profile</button>' +
                '<div class="nav-profile-menu" id="navProfileMenu">' +
                    '<hr>' +
                    '<button class="nav-profile-link" onclick="Auth.logout()" type="button">Logout</button>' +
                '</div>' +
            '</div>';
    },

    // No admin pages exist yet. Add their links here when they do.
    adminLinks: function (root) {
        return '' +
            '<a href="' + root + 'index.html" class="nav-link">Home</a>' +
            '<a href="' + root + 'pages/marketplace/marketplace.html" class="nav-link">Explore</a>' +
            '<div class="nav-profile-dropdown">' +
                '<button class="nav-link nav-profile-trigger" id="navProfileTrigger" type="button">Profile</button>' +
                '<div class="nav-profile-menu" id="navProfileMenu">' +
                    '<button class="nav-profile-link" onclick="Auth.logout()" type="button">Logout</button>' +
                '</div>' +
            '</div>';
    },

    /**
     * Remove any nav link whose href points at the current page.
     * Compares just the filename so relative-depth differences don't matter.
     */
    hideCurrentPageLink: function (navEl) {
        var currentFile = this.getCurrentFile();
        var links = navEl.querySelectorAll("a[href]");
        for (var i = 0; i < links.length; i++) {
            var href = links[i].getAttribute("href");
            var file = href.split("/").pop().split("?")[0];
            if (file === currentFile) {
                links[i].style.display = "none";
            }
        }
    },

    setupProfileDropdown: function (navEl) {
        var trigger = navEl.querySelector("#navProfileTrigger");
        var menu = navEl.querySelector("#navProfileMenu");
        if (!trigger || !menu) return;

        trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            menu.classList.toggle("open");
        });

        document.addEventListener("click", function () {
            menu.classList.remove("open");
        });
    },

    /** Show or hide the cart badge. Call this once the cart backend exists. */
    setCartCount: function (count) {
        var els = document.querySelectorAll("#cartCount");
        for (var i = 0; i < els.length; i++) {
            els[i].textContent = count;
            els[i].style.display = count > 0 ? "" : "none";
        }
    },

    render: function () {
        var navEl = document.querySelector(".main-nav");
        if (!navEl) return;

        var root = this.getRootPrefix();

        if (!Auth.isLoggedIn()) {
            navEl.innerHTML = this.guestLinks(root);
        } else {
            var role = Auth.getRole();
            if (role === "SELLER") {
                navEl.innerHTML = this.sellerLinks(root);
            } else if (role === "ADMIN") {
                navEl.innerHTML = this.adminLinks(root);
            } else {
                navEl.innerHTML = this.buyerLinks(root);
            }
        }

        this.hideCurrentPageLink(navEl);
        this.setupProfileDropdown(navEl);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    Nav.render();
});