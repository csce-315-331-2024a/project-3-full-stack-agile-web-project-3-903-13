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
    const { itemName, price, category } = req.body;
    db.query(
        'INSERT INTO menuitems (itemName, price, category) VALUES ($1, $2, $3)',
        [itemName, price, category],
        (err, result) => {
            if (err) {
                throw err;
            }
            res.status(201).send('Menu item added successfully');
        }
    );
};

module.exports = {
	retrieveMenuItems,
	addMenuItem,
}
