
/**
 * ARTISAN MARKETPLACE
 * Session Management & Route Guard Engine
 */

const SessionManager = {
    STORAGE_KEY: "artisan_active_session",

    getUser() {
        return StorageEngine.get(this.STORAGE_KEY, null);
    },

    setUser(user) {
        StorageEngine.set(this.STORAGE_KEY, user);
    },

    clearUser() {
        StorageEngine.remove(this.STORAGE_KEY);
    },

    isAuthenticated() {
        return !!this.getUser();
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            const path = window.location.pathname;
            if (path.includes("/pages/seller/") || path.includes("/pages/buyer/")) {
                window.location.href = "../auth/login.html";
            }
        }
    }
};
