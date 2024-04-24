const db = require('../config/db')

const retrieveEmployees = (req,res) => {
	db.query("SELECT * FROM employees", (err,results) => {
		if (err) {
			res.status(500).send("Internal Server Error");
			return;
		}
		res.status(200).json(results.rows)
	})
}

module.exports = {
	retrieveEmployees,
};
