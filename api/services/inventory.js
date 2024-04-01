const db = require('../config/db');

const retrieveInventoryItems = (req,res) => {
	db.query("SELECT * FROM inventory", (err,results) => {
		if (err) {
			res.status(400).send("Query Failed");
		}
		res.status(200).json(results.rows);
	})
}


const updateInventItemQuant = (req, res) => {
    const { itemName, newCount } = req.body;
	db.query(
		"Select * from inventory where ingredientname = $1", [itemName],
		(err, result) => {
			if (err){
				console.log(err);
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
							console.log(err);
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

const updateInventItemPrice = (req, res) => {
    const { itemName, newPrice } = req.body;
	db.query(
		"Select * from inventory where ingredientname = $1", [itemName],
		(err, result) => {
			if (err){
				console.log(err);
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
							console.log(err);
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

const updateInventItemMin = (req, res) => {
    const { itemName, newCount } = req.body;
	db.query(
		"Select * from inventory where ingredientname = $1", [itemName],
		(err, result) => {
			if (err){
				console.log(err);
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
							console.log(err);
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


const addInventoryItem = (req, res) => {
    const { itemName, count, price, mincount } = req.body;
	db.query(
		"Select * from inventory where ingredientname = $1", [itemName],
		(err, result) => {
			if (err){
				console.log(err);
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
							console.log(err);
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

const removeInventoryItem = (req, res) => {
    const { itemName } = req.body; 
    db.query(
        "DELETE FROM inventory WHERE ingredientname = $1",
        [itemName],
        (err, result) => {
            if (err) {
                console.error("Error removing inventory item:", err);
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

module.exports = {
	retrieveInventoryItems,
    updateInventItemQuant,
    updateInventItemPrice,
    updateInventItemMin,
    addInventoryItem,
    removeInventoryItem,
}