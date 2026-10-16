document.addEventListener("DOMContentLoaded", () => {
    const user = SessionManager.getUser();
    if (!user) {
        window.location.href = "../auth/login.html";
        return;
    }
    if (user.role !== "buyer") {
        window.location.href = "../seller/dashboard.html";
        return;
    }

    document.getElementById("name").value = user.name || "";
    document.getElementById("email").value = user.email || "";

    const buyers = StorageEngine.get("artisan_buyer_profiles", []);
    let profile = buyers.find(b => b.userId === user.id);
    if (profile) {
        document.getElementById("address").value = profile.address || "";
    }

    document.getElementById("profileForm").addEventListener("submit", (e) => {
        e.preventDefault();

        // Update user name
        const users = StorageEngine.get("artisan_users", []);
        const uIndex = users.findIndex(u => u.id === user.id);
        if (uIndex > -1) {
            users[uIndex].name = document.getElementById("name").value;
            StorageEngine.set("artisan_users", users);
            SessionManager.setUser(users[uIndex]);
        }

        // Update buyer profile address. If no profile row exists yet
        // for this user (e.g. it was never created at signup), create
        // one now instead of silently discarding the address.
        if (!profile) {
            profile = { id: generateId("buy"), userId: user.id, address: "" };
            buyers.push(profile);
        }
        profile.address = document.getElementById("address").value;
        StorageEngine.set("artisan_buyer_profiles", buyers);

        const alertEl = document.getElementById("profileAlert");
        alertEl.textContent = "Profile updated successfully!";
        alertEl.style.display = "block";
    });
});