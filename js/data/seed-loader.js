/**
 * ARTISAN MARKETPLACE
 * Initial CSV & Seed Data Loader
 */

const SeedLoader = {

    /**
     * Parse raw CSV text into array of objects.
     */
    parseCSV(csvText) {
        if (!csvText || typeof csvText !== "string") return [];
        
        const lines = csvText.trim().split("\n");
        if (lines.length < 2) return [];

        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ''));
        
        return lines.slice(1).map(line => {
            const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            
            headers.forEach((header, index) => {
                let value = values[index] ?? "";
                if (value === "true") value = true;
                else if (value === "false") value = false;
                else if (!isNaN(value) && value !== "") value = Number(value);
                
                row[header] = value;
            });
            
            return row;
        });
    },

    /**
     * Fallback initial data arrays if CSV files are not present.
     */
    getFallbackData() {
        return {
            users: [
                { id: "usr_seller_1", email: "anita@artisan.local", role: "seller", name: "Anita Sharma" },
                { id: "usr_buyer_1", email: "priya@artisan.local", role: "buyer", name: "Priya Patel" }
            ],
            seller_profiles: [
                { id: "sel_1", userId: "usr_seller_1", storeName: "Anita's Craft Studio", bio: "Handcrafted decor and pottery.", city: "Jaipur" }
            ],
            buyer_profiles: [
                { id: "buy_1", userId: "usr_buyer_1", address: "123 Main St, Mumbai" }
            ],
            products: [
                { id: "prod_1", sellerId: "sel_1", name: "Handpainted Terracotta Vase", category: "Home & Decor", price: 850, stock: 12, rating: 4.8 },
                { id: "prod_2", sellerId: "sel_1", name: "Handwoven Cotton Runner", category: "Home & Decor", price: 1200, stock: 8, rating: 4.9 }
            ],
            orders: [],
            order_items: [],
            transactions: []
        };
    },

    /**
     * Initialize local storage seed data.
     */
    async init(forceReset = false) {
        const isInitialized = StorageEngine.get("artisan_initialized", false);
        
        if (isInitialized && !forceReset) {
            console.log("[SeedLoader] Local storage already seeded.");
            return;
        }

        console.log("[SeedLoader] Initializing database seed data...");
        const fallback = this.getFallbackData();

        StorageEngine.set("artisan_users", fallback.users);
        StorageEngine.set("artisan_seller_profiles", fallback.seller_profiles);
        StorageEngine.set("artisan_buyer_profiles", fallback.buyer_profiles);
        StorageEngine.set("artisan_products", fallback.products);
        StorageEngine.set("artisan_orders", fallback.orders);
        StorageEngine.set("artisan_order_items", fallback.order_items);
        StorageEngine.set("artisan_transactions", fallback.transactions);
        StorageEngine.set("artisan_initialized", true);

        console.log("[SeedLoader] Seed data loaded successfully.");
    }
};