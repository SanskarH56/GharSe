/**
 * ARTISAN MARKETPLACE
 * CSV Seed Loader Engine
 */

const SeedLoader = {

    /**
     * Parse raw CSV text into an array of JavaScript objects.
     */
    parseCSV(csvText) {
        if (!csvText) return [];
        const lines = csvText.trim().split("\n");
        if (lines.length < 2) return [];

        const headers = lines[0].split(",").map(h => h.trim());
        const results = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            // Basic CSV parser handling quoted comma values
            const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(",");
            const row = {};

            headers.forEach((header, index) => {
                let val = values[index] ? values[index].trim() : "";
                val = val.replace(/^"|"$/g, ""); // Strip surrounding quotes
                row[header] = val;
            });

            results.push(row);
        }

        return results;
    },

    /**
     * Load CSV file from assets/data folder.
     */
    async fetchAndParse(fileName) {
        try {
            const response = await fetch(`../../data/${fileName}`);
            if (!response.ok) return [];
            const text = await response.text();
            return this.parseCSV(text);
        } catch (e) {
            console.warn(`Could not load ${fileName}, defaulting to empty array.`);
            return [];
        }
    },

    /**
     * Initialize CSV seed data into localStorage if empty.
     */
    async init() {
        // 1. Seed Users
        if (!StorageEngine.get("artisan_users")) {
            const users = await this.fetchAndParse("users.csv");
            StorageEngine.set("artisan_users", users);
        }

        // 2. Seed Seller Profiles
        if (!StorageEngine.get("artisan_seller_profiles")) {
            const sellers = await this.fetchAndParse("seller_profiles.csv");
            StorageEngine.set("artisan_seller_profiles", sellers);
        }

        // 3. Seed Buyer Profiles
        if (!StorageEngine.get("artisan_buyer_profiles")) {
            const buyers = await this.fetchAndParse("buyer_profiles.csv");
            StorageEngine.set("artisan_buyer_profiles", buyers);
        }

        // 4. Seed Products directly from CSV only (NO static arrays)
        if (!StorageEngine.get("artisan_products")) {
            const products = await this.fetchAndParse("products.csv");
            StorageEngine.set("artisan_products", products);
        }

        // 5. Seed Orders
        if (!StorageEngine.get("artisan_orders")) {
            const orders = await this.fetchAndParse("orders.csv");
            StorageEngine.set("artisan_orders", orders);
        }

        // 6. Seed Order Items
        if (!StorageEngine.get("artisan_order_items")) {
            const orderItems = await this.fetchAndParse("order_items.csv");
            StorageEngine.set("artisan_order_items", orderItems);
        }

        // 7. Seed Transactions
        if (!StorageEngine.get("artisan_transactions")) {
            const transactions = await this.fetchAndParse("transactions.csv");
            StorageEngine.set("artisan_transactions", transactions);
        }
    }
};

// Initialize seed data automatically when script runs
document.addEventListener("DOMContentLoaded", () => {
    SeedLoader.init();
});