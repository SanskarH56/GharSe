
/**
 * ARTISAN MARKETPLACE
 * PDF Export Helper
 */

const PDFExporter = {
    exportElementAsPDF(elementId, title) {
        const printContent = document.getElementById(elementId).outerHTML;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                        th { background: #f4f4f4; }
                    </style>
                </head>
                <body>
                    <h2>${title}</h2>
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 250);
    }
};
