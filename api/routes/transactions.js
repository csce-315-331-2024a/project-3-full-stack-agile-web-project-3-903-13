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
 * /transactions/getTransactionByID:
 *   post:
 *     summary: Get transaction information by ID
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionID:
 *                 type: integer
 *                 description: The ID of the transaction to retrieve information for
 *                 example: 359376
 *     responses:
 *       200:
 *         description: Transaction information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactiontime:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-04-28T10:16:39.820Z"
 *                   description: The timestamp of the transaction
 *                 cost:
 *                   type: number
 *                   example: 45.92
 *                   description: The total cost of the transaction
 *                 status:
 *                   type: string
 *                   example: "fulfilled"
 *                   description: The status of the transaction
 *                 transactionid:
 *                   type: integer
 *                   example: 359376
 *                   description: The ID of the transaction
 *                 components:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                         description: The ID of the component
 *                       itemname:
 *                         type: string
 *                         example: "Classic Hamburger"
 *                         description: The name of the component
 *                       price:
 *                         type: number
 *                         example: 6.89
 *                         description: The price of the component
 *                       quantity:
 *                         type: integer
 *                         example: 1
 *                         description: The quantity of the component
 *                       modif:
 *                         type: string
 *                         example: null
 *                         description: The modification of the component
 *       500:
 *         description: Internal Server Error
 * 
 * /transactions/getTransactionsByPeriod:
 *   post:
 *     summary: Retrieve details of transactions in a given time period
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the period to retrieve transactions for (YYYY-MM-DD)
 *                 example: "2024-04-20"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the period to retrieve transactions for (YYYY-MM-DD)
 *                 example: "2024-04-22"
 *     responses:
 *       200:
 *         description: Transaction information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   transactiontime:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the transaction
 *                     example: "2024-04-20T21:32:03.000Z"
 *                   cost:
 *                     type: number
 *                     description: The total cost of the transaction
 *                     example: 12.524525
 *                   status:
 *                     type: string
 *                     description: The status of the transaction
 *                     example: "fulfilled"
 *                   transactionid:
 *                     type: integer
 *                     description: The ID of the transaction
 *                     example: 359261
 *                   components:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: The ID of the component
 *                         itemname:
 *                           type: string
 *                           description: The name of the component
 *                         price:
 *                           type: number
 *                           description: The price of the component
 *                         quantity:
 *                           type: integer
 *                           description: The quantity of the component
 *                         modif:
 *                           type: string
 *                           description: The modification of the component
 *       500:
 *         description: Internal Server Error
 * 
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
 *	    summary: Updates the status of an order, changing it from in progress to completed
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/cancelOrder:
 *	  patch:
 *	    summary: Updates the status of an order, changing it from in progress to delete
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/recentFulfilledOrders:
 *	  get:
 *	    summary: Retrives all the orders that were completed in the last 5 minutes
 *	    tags: [Transactions]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/transactions/updateTransaction:
 *	  patch:
 *	    summary: Updates the menu item composition of an order when an order is updated
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
