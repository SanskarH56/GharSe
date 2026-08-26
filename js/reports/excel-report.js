
/**
 * ARTISAN MARKETPLACE
 * Excel Export Helper
 */

const ExcelExporter = {
    exportToCSV(filename, rows) {
        if (!rows || !rows.length) return;
        const headers = Object.keys(rows[0]).join(",");
        const csvContent = "data:text/csv;charset=utf-8," + 
            [headers, ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(","))].join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
