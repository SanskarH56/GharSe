function renderCart() {
            const summary = CartEngine.getSummary();
            const container = document.getElementById("cartItemsContainer");
            const subtotalEl = document.getElementById("cartSubtotal");
            const checkoutBtn = document.getElementById("checkoutBtn");

            subtotalEl.textContent = formatCurrency(summary.subtotal);

            if (summary.items.length === 0) {
                container.innerHTML = `
                    <div class="metric-card" style="text-align: center; padding: 40px;">
                        <p>Your cart is empty.</p>
                        <a href="marketplace.html" class="btn btn-secondary" style="margin-top: 14px;">Explore Products</a>
                    </div>
                `;
                checkoutBtn.style.pointerEvents = "none";
                checkoutBtn.style.opacity = "0.5";
                return;
            }

            checkoutBtn.style.pointerEvents = "auto";
            checkoutBtn.style.opacity = "1";

            container.innerHTML = summary.items.map(item => `
                <div class="metric-card" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; padding: 16px;">
                    <div>
                        <h4 style="margin: 0;">${escapeHTML(item.product.name)}</h4>
                        <span style="font-size: 0.85rem; color: var(--color-text-muted);">${formatCurrency(item.product.price)} each</span>
                    </div>

                    <div style="display: flex; align-items: center; gap: 15px;">
                        <input type="number" min="1" value="${item.quantity}" style="width: 60px; padding: 6px;" onchange="handleQuantityChange('${item.productId}', this)">
                        <strong>${formatCurrency(item.lineTotal)}</strong>
                        <button class="btn btn-secondary" style="padding: 6px 12px; color: var(--color-error);" onclick="CartEngine.removeItem('${item.productId}'); renderCart(); updateCartBadge();">Remove</button>
                    </div>
                </div>
            `).join("");
        }

        function handleQuantityChange(productId, inputEl) {
            const requestedQty = parseInt(inputEl.value, 10);
            CartEngine.updateQuantity(productId, requestedQty);

            // Check whether the requested quantity was clamped to available stock
            const summary = CartEngine.getSummary();
            const updatedItem = summary.items.find(i => i.productId === productId);
            if (updatedItem && requestedQty > updatedItem.quantity) {
                showToast(`Only ${updatedItem.quantity} left in stock — quantity adjusted.`, "error");
            }

            renderCart();
            updateCartBadge();
        }

        document.addEventListener("DOMContentLoaded", () => {
            const currentUser = SessionManager.getUser();
            if (!currentUser || currentUser.role === "seller") {
                document.getElementById("cartPageContainer").innerHTML = `
                    <div class="metric-card" style="text-align: center; padding: 50px 30px;">
                        <h2 style="margin-bottom: 10px;">${!currentUser ? "Log in to view your cart" : "Cart isn't available for sellers"}</h2>
                        <p style="color: var(--color-text-muted); margin-bottom: 24px;">
                            ${!currentUser
                                ? "Create a buyer account or log in to add items and check out."
                                : "Seller accounts can't purchase items. Log out and use a buyer account to shop."}
                        </p>
                        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                            ${!currentUser ? `
                                <a href="../auth/signup.html?role=buyer" class="btn btn-primary">Create Buyer Account</a>
                                <a href="../auth/login.html" class="btn btn-secondary">Log In</a>
                            ` : `
                                <button class="btn btn-primary" type="button" onclick="AuthController.logout()">Log Out</button>
                                <a href="../auth/signup.html?role=buyer" class="btn btn-secondary">Create Buyer Account</a>
                            `}
                        </div>
                    </div>
                `;
                return;
            }

            renderCart();
            updateCartBadge();
        });