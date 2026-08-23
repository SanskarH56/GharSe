/**
 * ARTISAN MARKETPLACE
 * Session Management Wrapper
 */

const SessionManager = {

    STORAGE_KEY: "artisan_current_user",

    /**
     * Get the currently logged-in user object or null.
     */
    getUser() {
        return StorageEngine.get(this.STORAGE_KEY, null);
    },

    /**
     * Set the active user session.
     */
    setUser(user) {
        if (!user) return false;
        // Do not store passwords in active session
        const safeUser = { ...user };
        delete safeUser.password;
        
        return StorageEngine.set(this.STORAGE_KEY, safeUser);
    },

    /**
     * Clear active session (logout).
     */
    clearUser() {
        return StorageEngine.remove(this.STORAGE_KEY);
    },

    /**
     * Check if a user is currently authenticated.
     */
    isAuthenticated() {
        return this.getUser() !== null;
    },

    /**
     * Get active user's role ("buyer" or "seller").
     */
    getRole() {
        const user = this.getUser();
        return user ? user.role : null;
    }
};