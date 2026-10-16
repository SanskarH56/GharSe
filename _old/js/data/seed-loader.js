
/**
 * ARTISAN MARKETPLACE
 * CSV Seed Loader Engine
 */

const SeedLoader = {

    /**
     * Split a single CSV line into field values.
     * Quote-aware: correctly preserves unquoted multi-word fields
     * (e.g. `Handwoven Cotton Shawl`) and quoted fields containing
     * commas (e.g. `"Award-winning, handmade textiles"`), with
     * support for escaped `""` inside quoted fields.
     */
    parseCSVLine(line) {
        const values = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (inQuotes) {
                if (char === '"') {
                    if (line[i + 1] === '"') {
                        current += '"';
                        i++; // skip escaped quote
                    } else {
                        inQuotes = false;
                    }
                } else {
                    current += char;
                }
            } else {
                if (char === '"' && current === "") {
                    inQuotes = true;
                } else if (char === ",") {
                    values.push(current.trim());
                    current = "";
                } else {
                    current += char;
                }
            }
        }
        values.push(current.trim());
        return values;
    },

    /**
     * Parse raw CSV text into an array of JavaScript objects.
     */
    parseCSV(csvText) {
        if (!csvText) return [];
        const lines = csvText.trim().split("\n");
        if (lines.length < 2) return [];

        const headers = this.parseCSVLine(lines[0]).map(h => h.trim());
        const results = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            const values = this.parseCSVLine(lines[i]);
            const row = {};

            headers.forEach((header, index) => {
                row[header] = values[index] !== undefined ? values[index] : "";
            });

            results.push(row);
        }

        return results;
    },

    /**
     * Compute the relative path prefix to the project root's /data/ folder
     * based on how deeply nested the current page is. This avoids hardcoding
     * "../../data/" which only works for pages exactly two folders deep
     * (e.g. pages/seller/dashboard.html) and silently breaks on pages at a
     * different depth, such as index.html at the project root.
     */
    getDataPathPrefix() {
        const path = window.location.pathname;
        // Count path segments after the last "/" that aren't the filename itself,
        // by checking how many "/pages/xxx/" style folders deep we are.
        if (path.includes("/pages/")) {
            return "../../data/";
        }
        return "data/";
    },

    /**
     * Load CSV file from the /data folder at the project root.
     */
    async fetchAndParse(fileName) {
        try {
            const prefix = this.getDataPathPrefix();
            const response = await fetch(`${prefix}${fileName}`);
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
