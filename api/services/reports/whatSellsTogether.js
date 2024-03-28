const db = require('../../config/db')

const generateReport = (req,res) => {
	const startDate = req.body.startDate
	const endDate = req.body.endDate

	console.log(startDate)

	// Report requires multiple queries. First, we need to make a view,
	// then, we need to make a join.
	const viewQuery = `CREATE VIEW valid AS (SELECT pairs.transactionid, pairs.item1, pairs.item2 FROM 
		pairs JOIN transactions ON pairs.transactionid = transactions.transactionid AND transactions.transactiontime 
		<= '${endDate}' AND transactions.transactiontime >= '${startDate}')`
	
	db.query(viewQuery, (err, results) => {
			if (err) {
				res.status(500)
				throw err;
			} else {
				const selectQuery = `SELECT m1name, m2name, count(*) AS paircount FROM (SELECT m1name, m2name FROM valid JOIN menupairs ON item1 = menupairs.m1id AND item2 = menupairs.m2id) AS nameditems GROUP BY m1name, m2name ORDER BY paircount DESC;`
				db.query(selectQuery, (err, results) => {
					if (err) {
						res.status(500)
						throw err
					}
					res.status(200).json(results.rows)
					db.query("DROP VIEW valid", (err, results) => {
						if (err) {
							throw err
						}
					})
				})
			}
	})
}

module.exports = {
	generateReport,
}
