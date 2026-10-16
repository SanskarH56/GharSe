/**
 * GharSe - seller dashboard. Shows the store from GET /v1/seller/me.
 * Sales figures come with the orders module; until then they stay as dashes.
 *
 * Needs: config.js, api.js, auth.js, nav.js.
 */
var SellerDashboard = {

    init: async function () {
        // Only a logged-in seller may see this page. Anyone else goes to login once.
        if (!Auth.isLoggedIn() || Auth.getRole() !== "SELLER") {
            window.location.href = "../auth/login.html";
            return;
        }
        await this.loadStore();
    },

    loadStore: async function () {
        var nameEl = document.getElementById("storeName");
        var locationEl = document.getElementById("storeLocation");

        try {
            var store = await Api.get("/seller/me");
            nameEl.textContent = store.businessName;
            locationEl.textContent = "Location: " + store.latitude + ", " + store.longitude;
        } catch (error) {
            nameEl.textContent = "Your store";
            this.showAlert(error.message);
        }
    },

    showAlert: function (message) {
        var el = document.getElementById("pageAlert");
        el.textContent = message;
        el.hidden = !message;
    }
};

document.addEventListener("DOMContentLoaded", function () {
    SellerDashboard.init();
});