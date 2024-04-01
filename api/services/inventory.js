const db = require('../config/db');

const retrieveInventoryItems = (req,res) => {
	db.query("SELECT * FROM inventory", (err,results) => {
		if (err) {
			res.status(400).send("Query Failed");
		}
		res.status(200).json(results.rows);
	})
}

module.exports = {
	retrieveInventoryItems,
}