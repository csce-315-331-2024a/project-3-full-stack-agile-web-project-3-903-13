const db = require('../../config/db')

const generateReport = (req,res) => {
	const startDate = req.body.startDate
	const endDate = req.body.endDate

	// Report requires multiple queries. First, we need to make a view,
	// then, we need to make a join.
	const viewQuery = `CREATE VIEW valid AS (SELECT pairs.transactionid, pairs.item1, pairs.item2 FROM 
		pairs JOIN transactions ON pairs.transactionid = transactions.transactionid AND transactions.transactiontime 
		<= $2::timestamp AND transactions.transactiontime >= $1::timestamp)`
	
	db.query(viewQuery, [startDate, endDate], (err, results) => {

			if (err) {
				res.status(500)
				throw err;
			} else {
				res.status(200).json(results.rows.length)
			}
	})
}

module.exports = {
	generateReport,
}
