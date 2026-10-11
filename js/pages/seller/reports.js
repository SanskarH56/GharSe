document.addEventListener("DOMContentLoaded", () => {
    const user = SessionManager.getUser();
    if (!user || user.role !== "seller") {
        window.location.href = "../auth/login.html";
        return;
    }
    const seller = DataService.getSellerByUserId(user.id);
    if (!seller) return;

    let currentData = [];

    function render() {
        const start = document.getElementById("startDate").value;
        const end = document.getElementById("endDate").value;
        const tbody = document.getElementById("reportTableBody");

        if (start && end && start > end) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--color-error);">"From Date" must be before "To Date". Please adjust your date range.</td></tr>`;
            currentData = [];
            return;
        }

        currentData = ReportEngine.getFilteredOrders(seller.id, start, end);

        if (currentData.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">No transaction records found for selected dates.</td></tr>`;
            return;
        }

        tbody.innerHTML = currentData.map(r => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid var(--color-border);">${escapeHTML(r.orderId)}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--color-border);">${r.date}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--color-border);">${escapeHTML(r.productName)}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--color-border);">${r.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--color-border);">${escapeHTML(r.paymentMethod)}</td>
                <td style="padding: 12px; border-bottom: 1px solid var(--color-border);"><strong>${formatCurrency(r.subtotal)}</strong></td>
            </tr>
        `).join("");
    }

    document.getElementById("btnFilter").addEventListener("click", render);
    document.getElementById("btnResetFilter").addEventListener("click", () => {
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
        render();
    });
    document.getElementById("btnExportCSV").addEventListener("click", () => {
        ExcelExporter.exportToCSV(`Sales_Report_${seller.id}`, currentData);
    });
    document.getElementById("btnExportPDF").addEventListener("click", () => {
        PDFExporter.exportElementAsPDF("reportTableArea", "Sales & Transaction Report");
    });

    render();
});