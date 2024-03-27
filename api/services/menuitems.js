const db = require('../config/db')

const retrieveMenuItems = (req,res) => {
	db.query("SELECT * FROM menuitems", (err,results) => {
		if (err) {
			throw err
		}
		res.status(200).json(results.rows)
	})
}

const addMenuItem = (req, res) => {
    const { itemName, price, category, ingredients, isSeasonal, expirationDate } = req.body;
    db.query(
        "SELECT * FROM menuitems WHERE itemName = $1", 
        [itemName],
        (err, result) => {
            if (err) {
                console.error("Error checking if item exists:", err);
                res.status(500).send("Internal Server Error");
                return;
            } else if (result.rows.length) {
                res.status(401).send("Item Already exists");
                return;
            } else {
                db.query(
					'INSERT INTO menuitems (itemName, price, category) VALUES ($1, $2, $3) RETURNING menuID',
					[itemName, price, category],
					(err, result) => {
						if (err) {
							console.error("Error adding new menu item:", err);
							res.status(500).send("Internal Server Error");
							return;
						}
						
						const menuID = result.rows[0].menuid; // Retrieve the menuID
						
						if (isSeasonal) {
							db.query(
								'INSERT INTO seasonalitems (menuid, expirationdate) VALUES ($1, $2::timestamp)',
								[menuID, expirationDate],
								(err) => {
									if (err) {
										console.error("Error adding seasonal item: ", err);
										res.status(400).send("Could not add seasonal item successfully");
										return;
									}
								}

							);
						}

						// Insert ingredients into the ingredients table
						const insertIngredientsQuery = 'INSERT INTO ingredients(menuID, inventID, quantity) VALUES ($1, $2, $3)';
						const values = ingredients.map(ingredient => [menuID, ingredient.inventID, ingredient.quantity]);
						for (let i = 0; i < values.length; i++){
							db.query(insertIngredientsQuery, values[i], (err, result) => {
								if (err) {
									console.error("Error inserting ingredients:", err);
									res.status(500).send("Internal Server Error");
									return;
								}
								res.status(201).send('Menu item added successfully');
							});
						}
					}
				);
            }
        }
    );
};





const updateMenuItem = (req, res) => {
    const { itemName, newPrice } = req.body;
	db.query(
		"Select * from menuitems where itemName = $1", [itemName],
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
					"UPDATE menuitems SET price = $1 WHERE itemName = $2",
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


module.exports = {
	retrieveMenuItems,
	addMenuItem,
	updateMenuItem,
}
