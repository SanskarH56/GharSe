/**
 * ARTISAN MARKETPLACE
 * Authentication Controller
 */

const AuthController = {

    /**
     * Authenticate user with email and password.
     */
    login(email, password) {
        const users = StorageEngine.get("artisan_users", []);
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return { success: false, message: "No account found with this email." };
        }

        // Demo password validation (accepts matching or demo fallback)
        if (user.password && user.password !== password) {
            return { success: false, message: "Invalid password." };
        }

        SessionManager.setUser(user);
        return { success: true, user };
    },

    /**
     * Register a new user (Buyer or Seller).
     */
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
            role: userData.role, // 'buyer' or 'seller'
            name: userData.name,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        StorageEngine.set("artisan_users", users);

        // Create corresponding role profile
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

    /**
     * Logout active session and redirect to home.
     */
    logout() {
        SessionManager.clearUser();
        window.location.href = "/index.html";
    },

    /**
     * Redirect user based on their active role.
     */
    redirectByRole(user) {
        if (user.role === "seller") {
            window.location.href = "/pages/seller/dashboard.html";
        } else {
            window.location.href = "/pages/marketplace/marketplace.html";
        }
    }
};