const express = require('express')
const router = express.Router()
const transactionsController = require('../services/transactions')


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


/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for managing transactions
 * /transactions/new:
 *   post:
 *     summary: Generate a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               totalCost:
 *                 type: number
 *                 description: The total cost of the transaction
 *                 example: 45.99
 *               taxAmount:
 *                 type: number
 *                 description: The tax amount of the transaction
 *                 example: 3.23
 *               orderContents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the item
 *                     itemname:
 *                       type: string
 *                       description: The name of the item
 *                     price:
 *                       type: number
 *                       description: The price of the item
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the item
 *                     modif:
 *                       type: string
 *                       description: The modification of the item
 *     responses:
 *       200:
 *         description: Successfully added transaction to database
 *       500:
 *         description: Internal Server Error
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
 *                           example: 123
 *                           description: The ID of the component
 *                         itemname:
 *                           type: string
 *                           example: Bacon Cheese
 *                           description: The name of the component
 *                         price:
 *                           type: number
 *                           example: 6.7
 *                           description: The price of the component
 *                         quantity:
 *                           type: integer
 *                           example: 3
 *                           description: The quantity of the component
 *                         modif:
 *                           type: string
 *                           example: No buns
 *                           description: The modification of the component
 *       500:
 *         description: Internal Server Error
 * 
* /transactions/deleteTransaction:
 *   delete:
 *     summary: Delete a transaction
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
 *                 description: The ID of the transaction to be deleted
 *                 example: 359392
 *               components:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the component
 *                     itemname:
 *                       type: string
 *                       description: The name of the component
 *                     price:
 *                       type: number
 *                       description: The price of the component
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the component
 *                     modif:
 *                       type: string
 *                       description: The modification of the component
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       500:
 *         description: Internal Server Error
 * /transactions/inProgressOrders:
 *   get:
 *     summary: Retrieve in progress orders
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: In progress orders retrieved successfully
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
 *                     example: "2024-04-28T06:39:33.000Z"
 *                   cost:
 *                     type: number
 *                     description: The total cost of the transaction
 *                     example: 45.19
 *                   status:
 *                     type: string
 *                     description: The status of the transaction
 *                     example: "in progress"
 *                   transactionid:
 *                     type: integer
 *                     description: The ID of the transaction
 *                     example: 359392
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
 * /transactions/fulfillOrder:
 *   post:
 *     summary: Marks an order as fulfilled
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
 *                 description: The ID of the transaction to be fulfilled
 *                 example: 359392
 *     responses:
 *       200:
 *         description: Order was marked as complete successfully
 *       500:
 *         description: Internal Server Error
 * /transactions/cancelOrder:
 *   patch:
 *     summary: Updates the status of an order, changing it from in progress to delete
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
 *                 description: The ID of the transaction to be cancelled
 *                 example: 359392
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       500:
 *         description: Internal Server Error
 * /transactions/recentFulfilledOrders:
 *   get:
 *     summary: Retrieve recent fulfilled orders
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Recent fulfilled orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   transactionid:
 *                     type: integer
 *                     description: The ID of the transaction
 *                     example: 359390
 *                   transactiontime:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the transaction
 *                     example: "2024-05-02T03:15:19.904Z"
 *                   totalcost:
 *                     type: number
 *                     description: The total cost of the transaction
 *                     example: 8.22
 *                   tax:
 *                     type: number
 *                     description: The tax amount of the transaction
 *                     example: 0.63
 *                   status:
 *                     type: string
 *                     description: The status of the transaction
 *                     example: "fulfilled"
 *       500:
 *         description: Internal Server Error
 * 
* /transactions/updateTransaction:
 *   patch:
 *     summary: Updates the menu item composition of an order when an order is updated
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
 *                 description: The ID of the transaction to be updated
 *                 example: 359392
 *               oldcomponents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the component
 *                     itemname:
 *                       type: string
 *                       description: The name of the component
 *                     price:
 *                       type: number
 *                       description: The price of the component
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the component
 *                     modif:
 *                       type: string
 *                       description: The modification of the component
 *               newComponents:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The ID of the new component
 *                     itemname:
 *                       type: string
 *                       description: The name of the new component
 *                     price:
 *                       type: number
 *                       description: The price of the new component
 *                     quantity:
 *                       type: integer
 *                       description: The quantity of the new component
 *                     modif:
 *                       type: string
 *                       description: The modification of the new component
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       500:
 *         description: Internal Server Error
 */