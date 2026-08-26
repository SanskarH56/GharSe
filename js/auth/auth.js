
/**
 * ARTISAN MARKETPLACE
 * Authentication Controller (Path-Aware)
 */

const AuthController = {

    /**
     * Determines path prefix depending on current page location.
     */
    getRelativePrefix() {
        const path = window.location.pathname;
        if (path.includes("/pages/auth/") || path.includes("/pages/seller/") || path.includes("/pages/buyer/") || path.includes("/pages/marketplace/")) {
            return "../";
        }
        return "pages/";
    },

    login(email, password) {
        const users = StorageEngine.get("artisan_users", []);
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return { success: false, message: "No account found with this email." };
        }

        if (user.password && user.password !== password) {
            return { success: false, message: "Invalid password." };
        }

        SessionManager.setUser(user);
        return { success: true, user };
    },

    signup(userData, profileData = {}) {
        const users = StorageEngine.get("artisan_users", []);
        
        if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            return { success: false, message: "An account with this email already exists." };
        }

        const userId = generateId("usr");
        const newUser = {
            id: userId,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            name: userData.name,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        StorageEngine.set("artisan_users", users);

        if (userData.role === "seller") {
            const sellers = StorageEngine.get("artisan_seller_profiles", []);
            sellers.push({
                id: generateId("sel"),
                userId: userId,
                storeName: profileData.storeName || `${userData.name}'s Studio`,
                bio: profileData.bio || "Handcrafted products made with care.",
                city: profileData.city || "Local Maker"
            });
            StorageEngine.set("artisan_seller_profiles", sellers);
        } else {
            const buyers = StorageEngine.get("artisan_buyer_profiles", []);
            buyers.push({
                id: generateId("buy"),
                userId: userId,
                address: profileData.address || ""
            });
            StorageEngine.set("artisan_buyer_profiles", buyers);
        }

        SessionManager.setUser(newUser);
        return { success: true, user: newUser };
    },

    logout() {
        SessionManager.clearUser();
        const path = window.location.pathname;
        if (path.includes("/pages/")) {
            window.location.href = "../../index.html";
        } else {
            window.location.href = "index.html";
        }
    },

    redirectByRole(user) {
        const path = window.location.pathname;
        
        if (user.role === "seller") {
            if (path.includes("/pages/auth/")) {
                window.location.href = "../seller/dashboard.html";
            } else if (!path.includes("/pages/")) {
                window.location.href = "pages/seller/dashboard.html";
            } else {
                window.location.href = "../seller/dashboard.html";
            }
        } else {
            if (path.includes("/pages/auth/")) {
                window.location.href = "../marketplace/marketplace.html";
            } else if (!path.includes("/pages/")) {
                window.location.href = "pages/marketplace/marketplace.html";
            } else {
                window.location.href = "../marketplace/marketplace.html";
            }
        }
    }
};
