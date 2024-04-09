const express = require('express')
const router = express.Router()
const {generateReport} = require('../services/reports/whatSellsTogether')
const {generateSalesReport} = require('../services/reports/salesReport')
const {generateRestockReport, fulfillRestock } = require('../services/reports/restockReport')
 

router.post("/whatSellsTogether", generateReport)

// Endpoint for retrieving the sales report
router.get('/salesReport', async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        res.status(400).send("Please provide both start and end dates.");
        return;
    }

    try {
        const reportData = await generateSalesReport(startDate, endDate);
        res.status(200).json(reportData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving sales report data');
    }
});

router.get("/restockReport", generateRestockReport);

router.patch("/restockInventory", fulfillRestock);


module.exports = router
// vim: tabstop=3
