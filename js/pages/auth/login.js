document.getElementById("loginForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const alertEl = document.getElementById("authAlert");
            alertEl.style.display = "none";

            const result = AuthController.login(
                document.getElementById("email").value,
                document.getElementById("password").value
            );

            if (result.success) {
                AuthController.redirectByRole(result.user);
            } else {
                alertEl.textContent = result.message;
                alertEl.style.display = "block";
            }
});