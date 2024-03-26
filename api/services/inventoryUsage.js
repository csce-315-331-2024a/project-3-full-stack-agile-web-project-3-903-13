const db = require('../config/db');

const isStartDateBeforeEndDate = (startDate, endDate) => new Date(startDate) < new Date(endDate);

const getInventoryUsage = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        if (!isStartDateBeforeEndDate(startDate, endDate)) {
            reject(new Error("Start date must be before end date."));
            return;
        }

        // This SQL mimics the creation and utilization of views in the Java code without actually creating views in the database
        const query = `
            WITH prem AS (
                SELECT 
                    t.transactionTime AS time,
                    t.transactionID AS transactionid,
                    f.menuID AS menuid,
                    i.inventID AS inventid,
                    f.quantity AS quantityItem
                FROM fooditems f
                JOIN transactions t ON t.transactionID = f.transactionID
                    AND t.transactionTime >= $1::timestamp
                    AND t.transactionTime <= $2::timestamp
                JOIN ingredients i ON f.menuid = i.menuid
            ), view AS (
                SELECT 
                    prem.time,
                    invent.ingredientname AS name,
                    prem.quantityItem,
                    i.quantity AS quantityIngred,
                    prem.quantityItem * i.quantity AS totalQuant
                FROM prem
                JOIN ingredients i ON prem.menuid = i.menuid AND prem.inventid = i.inventid
                JOIN inventory invent ON invent.inventID = prem.inventid
            )
            SELECT name, SUM(totalQuant) AS totalInventoryUsed
            FROM view
            GROUP BY name
            ORDER BY name;
        `;

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
