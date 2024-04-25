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

router.patch('/updateTransaction', transactionsController.updateTransaction)


module.exports = router
// vim: tabstop=3
