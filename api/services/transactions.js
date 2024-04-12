const { response } = require('express');
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
		const results = await db.query("INSERT INTO transactions values (DEFAULT, $1::timestamp, $2, $3, 'in progress') RETURNING transactionid", [currentDate,totalCost,taxAmount])
		return results.rows[0].transactionid
	} catch (err) {
		console.log(err)
	}
}

const updateFoodItemsTable = async (id, orderContents) => {
    for (const item of orderContents) {
        try {
            await db.query("INSERT INTO fooditems VALUES (DEFAULT, $1, $2, $3)", [id, item.id, item.quantity]);
        } catch (err) {
            // console.error(err);
            throw err; // Re-throw the error to handle it in the caller function
        }
    }
};

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

const incrementInventory = async (components) => {
	components.map(async (item) => {
		try {
			const results = await db.query("SELECT inventid, quantity FROM ingredients WHERE menuid = $1", [item.id])
			results.rows.map((inventory) => {
				db.query("UPDATE inventory SET count = count + $1 WHERE inventid = $2", [item.quantity*inventory.quantity, inventory.inventid])
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
	// console.log(valid)
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


const deleteTransaction = async (request, response) => {
	const {transactionID, components} = request.body;

	try {
		// Delete from transactions table, fooditems table (menu items) and return items to inventory?
		// Delete from fooditems first since it uses transactions as foreign key
		const results = await db.query(`DELETE from fooditems WHERE transactionid = ${transactionID}`) 
		const results2 = await db.query(`DELETE FROM transactions WHERE transactionID = ${transactionID}`);
		incrementInventory(components)
		response.status(200).send("Transaction Deleted")
	}
	catch (err) {
		console.log(err)
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
	Gets the information about a transaction based on a transaction ID
*/
const getTransactionInfo = async (transactionid) => {
	const queryTimeResults = await db.query(`SELECT transactiontime, totalcost, status FROM transactions WHERE transactionid = ${transactionid}`)
	const transactiontime = queryTimeResults.rows[0]["transactiontime"]
	const cost = queryTimeResults.rows[0]["totalcost"]
	const status = queryTimeResults.rows[0]["status"]

	const query = `SELECT fooditems.menuid as ID, menuitems.itemname as Name, fooditems.quantity as Quantity
			FROM fooditems
			INNER JOIN menuitems 
				ON menuitems.menuid = fooditems.menuid
			WHERE fooditems.transactionid = ${transactionid}
			ORDER BY Name;`

	try {
		const results = await db.query(query);
		return {transactiontime, cost, status, transactionid: transactionid, components: results.rows};
	}
	catch (err){
		throw err
	}
	
}

/* 
	Gets the information about the first 50 transactions orders within given time frame
*/
const getTransactionsByPeriod = async (request, response) => {
	const {startDate, endDate} = request.body;
	
	try{
		const query = `SELECT transactionid as id
						FROM transactions
						WHERE transactiontime >= $1::timestamp AND transactiontime <= $2::timestamp
						ORDER BY transactiontime 
						LIMIT 50
						`

		const result = await db.query(query, [startDate, endDate]);
		const transactionIDs = result.rows.map(row => row.id);
	
		const transactionsInfo = await getTransactionsInfo(transactionIDs)	
		response.status(200).json(transactionsInfo)

	} catch (error){
		throw error
	}	
}

const getInProgressOrders = async(request, response) => {
	const query = `SELECT transactionid FROM transactions WHERE status = 'in progress';`

	try {
		const result = await db.query(query);
		const transactionIDs = result.rows.map(row => row.transactionid);

		const transactionsInfo = await getTransactionsInfo(transactionIDs);
		response.status(200).json(transactionsInfo)
	}
	catch (error){
		throw error
	}
}

const fullfillOrder = async(request, response) => {
	const {transactionID} = request.body;

	const query = `UPDATE transactions SET status = 'fulfilled' WHERE transactionid = ${transactionID};`

	try {
		db.query(query);
	}
	catch (error) {
		throw error 
	}
}

// Gets information about each transactionID passed in an array
const getTransactionsInfo = async(transactionIDs) => {
    const transactionsInfoPromises = transactionIDs.map(async id => {
        return await getTransactionInfo(id);
    });

    return Promise.all(transactionsInfoPromises);
}

module.exports = {
    createTransaction,
    insertTransaction,
    updateFoodItemsTable,
    decrementInventory,
	getTransactionInfo,
	getTransactionsByPeriod,
	deleteTransaction,
	getInProgressOrders, 
	fullfillOrder
}
