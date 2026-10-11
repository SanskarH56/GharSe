document.addEventListener("DOMContentLoaded", () => {
    const user = SessionManager.getUser();
    if (!user || user.role !== "seller") {
        window.location.href = "../auth/login.html";
        return;
    }
    const seller = DataService.getSellerByUserId(user.id);
    if (seller) SellerAnalytics.renderDashboard(seller.id);
});