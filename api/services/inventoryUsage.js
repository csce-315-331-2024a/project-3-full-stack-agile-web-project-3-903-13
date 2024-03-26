const db = require('../config/db');

// Helper function to check date validity
const isStartDateBeforeEndDate = (startDate, endDate) => new Date(startDate) < new Date(endDate);

const getInventoryUsage = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        if (!isValidDate(startDate) || !isValidDate(endDate)) {
            reject(new Error("Invalid date format. Please use YYYY-MM-DD."));
            return;
        }

        if (!isStartDateBeforeEndDate(startDate, endDate)) {
            reject(new Error("Start date must be before end date."));
            return;
        }

        const query = 
        `WITH prem AS (
                SELECT f.menuid, i.inventID, f.quantity
                FROM fooditems f
                JOIN transactions t ON t.transactionID = f.transactionID
                AND t.transactionTime >= $1 AND t.transactionTime <= $2
                JOIN ingredients i ON f.menuid = i.menuid
            ), view AS (
                SELECT invent.ingredientname AS name, prem.quantity * i.quantity AS totalQuant
                FROM prem
                JOIN ingredients i ON prem.menuid = i.menuid AND prem.inventid = i.inventid
                JOIN inventory invent ON invent.inventID = prem.inventID
            )
            SELECT name, SUM(totalQuant) AS totalInventoryUsed
            FROM view
            GROUP BY name
            ORDER BY name;`;

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
    getInventoryUsage
};
