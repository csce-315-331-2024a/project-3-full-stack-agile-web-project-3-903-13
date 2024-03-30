const db = require('../config/db')

const insertTransaction = (totalCost, taxAmount) => {
	var currentDate = new Date().toLocaleString()
	db.query("INSERT INTO transactions values (DEFAULT, $1::timestamp, $2, $3)", [currentDate,totalCost,taxAmount], (err,results) => {
		if (err) {
			throw err;
		}
	})
}

const createTransaction = (req,res) => {
	const totalCost = req.body.totalCost
	const taxAmount = req.body.taxAmount
	const orderContents = req.body.orderContents

	try {
		insertTransaction(totalCost,taxAmount)
	} catch (error) {
		console.log(error)	
	}

	console.log("new tranaction yay!")
}

module.exports = {
	createTransaction
}
