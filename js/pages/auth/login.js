document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("loginForm");
    var alertEl = document.getElementById("authAlert");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        alertEl.style.display = "none";

        try {
            var data = await AuthService.login(
                document.getElementById("email").value,
                document.getElementById("password").value
            );
            window.location.href = data.role === "SELLER" || data.role === "ADMIN"
                ? "/pages/seller/dashboard.html"
                : "/pages/marketplace/marketplace.html";
        } catch (error) {
            alertEl.textContent = error.message;
            alertEl.style.display = "block";
        }
    });
});