
/**
 * ARTISAN MARKETPLACE
 * Storage Engine Wrapper
 */

const StorageEngine = {
    /**
     * Retrieve and parse JSON item from localStorage.
     */
    get(key, fallback = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : fallback;
        } catch (error) {
            console.error(`[StorageEngine] Error reading key "${key}":`, error);
            return fallback;
        }
    },

    /**
     * Serialize and save item to localStorage.
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`[StorageEngine] Error setting key "${key}":`, error);
            return false;
        }
    },

    /**
     * Remove an item from localStorage.
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`[StorageEngine] Error removing key "${key}":`, error);
            return false;
        }
    },

    /**
     * Clear all application storage keys.
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error("[StorageEngine] Error clearing storage:", error);
            return false;
        }
    }
};
