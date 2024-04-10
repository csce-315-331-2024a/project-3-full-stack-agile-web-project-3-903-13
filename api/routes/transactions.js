const express = require('express')
const router = express.Router()
const transactionsController = require('../services/transactions')

router.post("/new", transactionsController.createTransaction)

router.post('/getTransactionByID', async (request, response) => {
    const { transactionID} = request.body;

    try {
        const results = await transactionsController.retrieveTransactionByID(transactionID);
        response.status(200).json(results);
    } catch (err) {
        // console.error(err);
        res.status(500).send('Error retrieving data');
    }
});

router.post("/getTransactionsByPeriod", transactionsController.retrieveTransactionsByPeriod)


module.exports = router
// vim: tabstop=3
