const db = require('../config/db')

const retrieveMenuItems = (req,res) => {
	db.query("SELECT * FROM menuitems", (err,results) => {
		if (err) {
			res.status(500).send("Internal Server Error");
			return;
		}
		res.status(200).json(results.rows)
	})
}

const getDetails = (req, res) => {
	const {name} = req.query;

	db.query("SELECT * FROM menuitems WHERE itemname = $1", [name], (err,results) => {
		if (err) {
			res.status(500).send("Internal Server Error");
			return;
		}
		res.status(200).json(results.rows)
	})
}

const retrieveMenuItemIngredients = (req,res) => {
	const { itemName } = req.query; // Extract itemName from query parameters
	db.query("SELECT * FROM menuitems where itemname = $1", 
	[itemName],
	(err,result) => {
		if (err) {
			res.status(400).send("Query Failed");
			return;
		} else if (!(result.rows.length)) {
			res.status(401).send("Item Doesn't exist");
			return;
		} else {
			const menuID = result.rows[0].menuid; // Retrieve the menuID
			db.query("SELECT i.inventid, i.ingredientname, i.count, i.price, i.mincount, ing.quantity FROM inventory i JOIN ingredients ing ON i.inventid = ing.inventid WHERE ing.menuid = $1",
			[menuID],
			(err, results) => {
				if (err){
					console.error("Error checking if item exists:", err);
					res.status(500).send("Internal Server Error");
					return;
				}
				res.status(200).json(results.rows);
			}
			)
		}
	})
}

const retrieveSeasonalInfo = (req,res) => {
	const { itemName } = req.query; // Extract itemName from query parameters
	db.query("SELECT * FROM menuitems where itemname = $1", 
	[itemName],
	(err,result) => {
		if (err) {
			res.status(400).send("Query Failed");
			return;
		} else if (!(result.rows.length)) {
			res.status(401).send("Item Doesn't exist");
			return;
		} else {
			const menuID = result.rows[0].menuid; // Retrieve the menuID
			db.query("SELECT * from seasonalitems WHERE menuid = $1",
			[menuID],
			(err, results) => {
				if (err){
					console.error("Error checking if item exists:", err);
					res.status(500).send("Internal Server Error");
					return;
				}
				res.status(200).json(results.rows);
			}
			)
		}
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
								
							});
						}
						res.status(201).send('Menu item added successfully');
					}
				);
            }
        }
    );
};





const updateMenuItemPrice = (req, res) => {
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

const updateMenuItemCat = (req, res) => {
    const { itemName, newCat } = req.body;
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
					"UPDATE menuitems SET category = $1 WHERE itemName = $2",
					[newCat, itemName],
					(err, result) => {
						if (err) {
							console.log(err);
							res.status(500);
							return;
						}
						res.status(202).send(`Category of ${itemName} updated successfully`);
					}
				);
			}
		}
	);
    
};

const updateMenuItemIngred = (req, res) => {
    const { itemName, ingredients } = req.body;
	db.query(
		"Select * from menuitems where itemName = $1", 
		[itemName],
		(err, result) => {
			if (err){
				console.log(err);
				res.status(500);
				return;
			} else if (!(result.rows.length)){
				res.status(401).send("Item Doesn't exist");
				return;
			} else {
				const menuID = result.rows[0].menuid;
				db.query(
					"DELETE FROM ingredients WHERE menuid = $1",
					[menuID],
					(err) => {
						if (err) {
							console.log(err);
							res.status(500);
							return;
						} else {
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
									
								});
							}
							res.status(202).send(`Ingredients of ${itemName} updated successfully`);
						}
						
					}
				);
			}
		}
	);
    
};

const removeMenuItem = (req, res) => {
    const { itemName } = req.body; 
    
	db.query(
		"SELECT menuid FROM menuitems WHERE itemname = $1",
		[itemName],
		(err, result) => {
			if (err){
				res.status(500).send("Internal Server Error");
				return;
			} else if (result.rowCount == 0) {
				res.status(404).send("Menu item not found");
			} else {
				const menuID = result.rows[0].menuid;
				db.query(
					"DELETE FROM ingredients WHERE menuid = $1",
					[menuID],
					(err) => {
						if (err){
							console.error("Error removing inventory item ingredients:", err);
							res.status(500).send("Internal Server Error");
							return;
						} else {
							db.query(
								"DELETE FROM seasonalitems WHERE menuid = $1",
								[menuID],
								(err, result) => {
									if (err){
										console.error("Error removing menu item: from seasonalitems", err);
										res.status(500).send("Internal Server Error");
										return;
									} else {
										db.query(
											"DELETE FROM menuitems WHERE itemname = $1",
											[itemName],
											(err, result) => {
												if (err) {
													console.error("Error removing menu item: from menuitems", err);
													res.status(500).send("Internal Server Error");
													return;
												} else {
													res.status(200).send(`Menu item with name ${itemName} removed successfully`);
												}
											}
										);	
									}
								}
							)
							
						}
					}
				);
			}
		}
	);
	
};


module.exports = {
	retrieveMenuItems,
	retrieveMenuItemIngredients,
	addMenuItem,
	updateMenuItemPrice,
	updateMenuItemCat,
	removeMenuItem,
	updateMenuItemIngred,
	retrieveSeasonalInfo,
	getDetails
	
}
// vim: tabstop=3