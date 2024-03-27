const db = require('../config/db');

const getInventoryState = (request, response) => {
    // Query returns the state of the inventory at the start date
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
        SELECT name, SUM(totalQuant) AS InventoryBegin
        FROM view
        GROUP BY name
        ORDER BY name;
    `;

    const {startDate} = request.query;

    db.query(query, [startDate], (err, results) => {
        if (err) {
            throw (err);
        } else {
            response.status(200).json(results.rows)
        }
    });
};

module.exports = {
    getInventoryState
};