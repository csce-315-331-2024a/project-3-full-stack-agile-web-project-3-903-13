const db = require('../config/db')

const verifyOrderFormatting = (orderContents) => {
	var isValid = true
	orderContents.forEach((element) => {
		if (element.id === undefined || element.quantity === undefined) {
			isValid = false
		}
	});
	return isValid
}

const insertTransaction = async (totalCost, taxAmount) => {
	var currentDate = new Date().toLocaleString()

	try {
		const results = await db.query("INSERT INTO transactions values (DEFAULT, $1::timestamp, $2, $3) RETURNING transactionid", [currentDate,totalCost,taxAmount])
		return results.rows[0].transactionid
	} catch (err) {
		console.log(err)
	}
}

const updateFoodItemsTable = async (id, orderContents) => {
	orderContents.map((item) => {
		db.query("INSERT INTO fooditems VALUES (DEFAULT, $1, $2, $3)", [id, item.id, item.quantity], (err) => {
			if (err) {
				throw err
			}
		})		
	})
}

const decrementInventory = async (orderContents) => {
	orderContents.map(async (item) => {
		// Get entries from ingredients table (tells which menu items use which inventory items)
		try {
			const results = await db.query("SELECT inventid, quantity FROM ingredients WHERE menuid = $1", [item.id])
			results.rows.map((inventory) => {
				db.query("UPDATE inventory SET count = count - $1 WHERE inventid = $2", [item.quantity*inventory.quantity, inventory.inventid])
			})
		} catch (err) {
			console.log(err)
		}
	})
}

const createTransaction = async (req,res) => {
	const totalCost = req.body.totalCost
	const taxAmount = req.body.taxAmount
	const orderContents = req.body.orderContents
	
	if (!totalCost || !taxAmount || !orderContents) {
		res.status(400).send("Missing parts of request")
		return
	}

	const valid = verifyOrderFormatting(orderContents)
	console.log(valid)
	if (!valid) {
		res.status(400).send("Invalid formatting of error contents.")
		return
	}
	
	try {
		const transactionid = await insertTransaction(totalCost,taxAmount)
		res.status(200).send("Successfully added transaction to database")
		updateFoodItemsTable(transactionid, orderContents)
		decrementInventory(orderContents)
	} catch (error) {
		console.log(error)	
	}
}

const updateTransaction = async (request, response) => {
	/* 
		Delete an item
			Reduce $ in transactions table
			Increase Inventory
	*/
}

/* 
	Retrive the list of items in a transaction based on a transaction id
*/
const retrieveTransactionByID = async (transactionid) => {
	query = `SELECT fooditems.menuid as ID, menuitems.itemname as Name, fooditems.quantity as Quantity
			FROM fooditems
			INNER JOIN menuitems 
				ON menuitems.menuid = fooditems.menuid
			WHERE fooditems.transactionid = ${transactionid};`

	try {
		const results = await db.query(query);
		return results.rows;
	}
	catch (err){
		throw err
	}
	
}

// Retrives the information about the first 50 transactions orders within given time frame
const retrieveTransactionsByPeriod = async (request, response) => {
	const {startDate, endDate} = request.body;
	
	// Get first 50 transactions and respective IDs first
	try{
		const query = `SELECT transactionid as id
			FROM transactions
			WHERE transactiontime >= $1::timestamp AND transactiontime <= $2::timestamp 
			LIMIT 50
			`

	const result = await db.query(query, [startDate, endDate]);
	const transactionIDs = result.rows.map(row => row.id);
	
	const transactionsInfoPromises = transactionIDs.map(async id => {
		const resp = await retrieveTransactionByID(id);
		return {transactionid: id, components: resp}
	});

	const transactionsInfo = await Promise.all(transactionsInfoPromises);	
	response.status(200).json(transactionsInfo)

	} catch (error){
		throw error
	}	
}

module.exports = {
	createTransaction,
	retrieveTransactionByID,
	retrieveTransactionsByPeriod
}
