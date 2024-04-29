const db = require('../config/db');

/* 
	Retrieves all inventory items
*/
const getInventoryItems = (req,res) => {
	db.query("SELECT * FROM inventory ORDER BY ingredientname", (err,results) => {
		if (err) {
			res.status(400).send("Query Failed");
			return;
		}
		res.status(200).json(results.rows);
	})
}

/* 
	Updates the quantity of an inventory item Given the name of the item and the new quantity
*/
const updateInventItemQuant = (req, res) => {
    const { itemName, newCount } = req.body;
	db.query(
		"Select * from inventory where ingredientname = $1", [itemName],
		(err, result) => {
			if (err){
				// console.log(err);
				res.status(500);
				return;
			} else if (!(result.rows.length)){
				res.status(401).send("Item Doesn't exist");
				return;
			} else {
				db.query(
					"UPDATE inventory SET count = $1 WHERE ingredientname = $2",
					[newCount, itemName],
					(err, result) => {
						if (err) {
							// console.log(err);
							res.status(500);
							return;
						}
						res.status(202).send(`Count of ${itemName} updated successfully`);
					}
				);
			}
		}
	);
    
};

/* 
	Updates the price of an item in the inventory
*/
const updateInventItemPrice = (req, res) => {
    const { itemName, newPrice } = req.body;
	db.query(
		"Select * from inventory where ingredientname = $1", [itemName],
		(err, result) => {
			if (err){
				// console.log(err);
				res.status(500);
				return;
			} else if (!(result.rows.length)){
				res.status(401).send("Item Doesn't exist");
				return;
			} else {
				db.query(
					"UPDATE inventory SET price = $1 WHERE ingredientname = $2",
					[newPrice, itemName],
					(err, result) => {
						if (err) {
							// console.log(err);
							res.status(500);
							return;
						}
						res.status(202).send(`Price of ${itemName} updated successfully`);
					}
				);
			}
		}
	);
    
};

/*
	Updates an inventory item's MIN COUNT
*/
const updateInventItemMin = (req, res) => {
    const { itemName, newCount } = req.body;
	db.query(
		"Select * from inventory where ingredientname = $1", [itemName],
		(err, result) => {
			if (err){
				// console.log(err);
				res.status(500);
				return;
			} else if (!(result.rows.length)){
				res.status(401).send("Item Doesn't exist");
				return;
			} else {
				db.query(
					"UPDATE inventory SET mincount = $1 WHERE ingredientname = $2",
					[newCount, itemName],
					(err, result) => {
						if (err) {
							// console.log(err);
							res.status(500);
							return;
						}
						res.status(202).send(`MinCount of ${itemName} updated successfully`);
					}
				);
			}
		}
	);
    
};

/* 
	Adds a NEW ITEM to the inventory
*/
const addInventoryItem = (req, res) => {
    const { itemName, count, price, mincount } = req.body;
	db.query(
		"Select * from inventory where ingredientname = $1", [itemName],
		(err, result) => {
			if (err){
				// console.log(err);
				res.status(500);
				return;
			} else if (result.rows.length){
				res.status(401).send("Item Already exists");
				return;
			} else {
				db.query(
					'INSERT INTO inventory (ingredientname, count, price, mincount) VALUES ($1, $2, $3, $4)',
					[itemName, count, price, mincount ],
					(err, result) => {
						if (err) {
							// console.log(err);
							res.status(500);
							return;
						}
						res.status(201).send('Inventory item added successfully');
					}
				);
			}
		}
	);
    
};

/* 
	Removes an inventory item name given the NAME
*/
const removeInventoryItem = (req, res) => {
    const { itemName } = req.body; 
    db.query(
        "DELETE FROM inventory WHERE ingredientname = $1",
        [itemName],
        (err, result) => {
            if (err) {
                // console.error("Error removing inventory item:", err);
                res.status(500).send("Internal Server Error");
                return;
            }
            if (result.rowCount === 0) {
                // If no rows were deleted, it means the menu item with the specified ID was not found
                res.status(404).send("Inventory item not found");
                return;
            }
            res.status(200).send(`Inventory item with name ${itemName} removed successfully`);
        }
    );
};


/* 
	Query for features: Excess Report
	Retrives the state of the inventory at the given start date
*/
const getInventoryState = (request, response) => {
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

/* 
	Query for Features: Excess Report and Restock Report
	Gets inventory usage for each item between 2 dates provided: start date and end date
*/

const getInventoryUsage = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        if (!(new Date(startDate) < new Date(endDate))) {
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
	getInventoryItems,
    updateInventItemQuant,
    updateInventItemPrice,
    updateInventItemMin,
    addInventoryItem,
    removeInventoryItem,
	getInventoryState,
	getInventoryUsage
}