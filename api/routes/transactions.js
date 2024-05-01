const express = require('express')
const router = express.Router()
const transactionsController = require('../services/transactions')

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for managing transactions
 *	/transactions/new:
 *	  post:
 *	    summary: Generate a new transaction
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/getTransactionByID:
 *	  post:
 *	    summary: Retrieve details of a transaction given its ID
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/getTransactionByPeriod:
 *	  post:
 *	    summary: Retrieve details of transactions in a given time period
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/deletetransaction:
 *	  delete:
 *	    summary: Delete a transaction
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/inProgressOrders:
 *	  get:
 *	    summary: Get list of orders in progress 
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/fulfillOrder:
 *	  patch:
 *	    summary: 
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/cancelOrder:
 *	  patch:
 *	    summary: 
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/recentFulfilledOrders:
 *	  get:
 *	    summary: 
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/updateTransaction:
 *	  patch:
 *	    summary: 
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 */

router.post("/new", transactionsController.createTransaction)

router.post('/getTransactionByID', async (request, response) => {
    const { transactionID} = request.body;

    try {
        const results = await transactionsController.getTransactionInfo(transactionID);
        response.status(200).json(results);
    } catch (err) {
        response.status(500).send('Error retrieving transaction. ID may be invalid or deleted. Kindly check the ID');
        // response.status(500).send(err.message);
    }
});

router.post("/getTransactionsByPeriod", transactionsController.getTransactionsByPeriod)
router.delete("/deletetransaction", transactionsController.deleteTransaction)

router.get('/inProgressOrders', transactionsController.getInProgressOrders)
router.patch('/fulfillOrder', transactionsController.fullfillOrder)
router.patch('/cancelOrder', transactionsController.cancelOrder)
router.get('/recentFulfilledOrders', transactionsController.getRecentFulfilledOrders);
router.patch('/updateTransaction', transactionsController.updateTransaction)


module.exports = router
// vim: tabstop=3
