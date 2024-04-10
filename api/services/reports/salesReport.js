const db = require('../../config/db');

// Helper functions for date validation
const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
const isStartDateBeforeEndDate = (startDate, endDate) => new Date(startDate) < new Date(endDate);

const generateSalesReport = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        if (!isStartDateBeforeEndDate(startDate, endDate)) {
            reject(new Error("Start date must be before end date."));
            return;
        }

        const query = 
            `SELECT mi.itemName, SUM(fi.quantity) AS quantity_sold, 
            ROUND(SUM(fi.quantity * mi.price)::numeric, 2) AS total_sales
            FROM foodItems fi 
            JOIN menuItems mi ON fi.menuID = mi.menuID 
            JOIN transactions t ON fi.transactionID = t.transactionID 
            WHERE t.transactionTime >= $1::timestamp AND t.transactionTime < $2::timestamp 
            GROUP BY mi.itemName 
            ORDER BY total_sales DESC`;

        db.query(query, [startDate, endDate], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.rows);
            }
        });
    });
};

module.exports = {
    generateSalesReport
};