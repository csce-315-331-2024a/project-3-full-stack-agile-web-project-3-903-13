<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const { getSalesReport } = require('../services/salesReport');

// Endpoint for retrieving the sales report
router.get('/salesreport', async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        res.status(400).send("Please provide both start and end dates.");
        return;
    }

    try {
        const reportData = await getSalesReport(startDate, endDate);
        res.status(200).json(reportData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving sales report data');
    }
});

module.exports = router;
=======
const express = require('express')
const router = express.Router()
const transcationsController = require('../services/transactions')

router.post("/new", transcationsController.createTransaction)

router.get("/", (req,res) => {
})

module.exports = router
// vim: tabstop=3
>>>>>>> main
