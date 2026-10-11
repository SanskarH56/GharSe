document.addEventListener("DOMContentLoaded", () => {
            const params = new URLSearchParams(window.location.search);
            const roleParam = params.get("role");
            if (roleParam === "buyer" || roleParam === "seller") {
                const radio = document.getElementById(roleParam === "buyer" ? "roleBuyer" : "roleSeller");
                if (radio) radio.checked = true;
            }
        });

        document.getElementById("signupForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const alertEl = document.getElementById("authAlert");
            alertEl.style.display = "none";

            const selectedRoleInput = document.querySelector('input[name="role"]:checked');
            if (!selectedRoleInput) {
                alertEl.textContent = "Please choose whether you want to buy or sell.";
                alertEl.style.display = "block";
                return;
            }

            const result = AuthController.signup({
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                role: selectedRoleInput.value
            });

            if (result.success) {
                AuthController.redirectByRole(result.user);
            } else {
                alertEl.textContent = result.message;
                alertEl.style.display = "block";
            }
});