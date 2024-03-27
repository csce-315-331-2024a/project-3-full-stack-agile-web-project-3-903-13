const db = require('../config/db')

const generateReport = (req,res) => {
	const startDate = req.params.startDate
	const endDate = req.params.endDate
	res.status(200).send({'startDate': startDate, 'endDate': endDate})
}

module.exports = {
	generateReport,
}
