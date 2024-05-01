const express = require('express')
const router = express.Router()
const {generateReport} = require('../services/reports/whatSellsTogether')
const {generateSalesReport} = require('../services/reports/salesReport')
const {generateRestockReport, fulfillRestock } = require('../services/reports/restockReport')

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: API for generating analytics reports
 *	/reports/whatSellsTogether:
 *	  post:
 *	    summary: Generate the "What Sells Together" report given a start date and an end date
 *	    tags: [Reports]
 *	/reports/salesReport:
 *	  get:
 *	    summary: Generate the "Sales" report given a start date and an end date
 *	    tags: [Reports]
 *	/reports/restockReport:
 *	  get:
 *	    summary: Generate the "Restock" report given a start date and an end date
 *	    tags: [Reports]
 *	/reports/restockInventory:
 *	  patch:
 *	    summary: Updates the quantity of all the ingredients in the inventory that were below the minimum count
 *	    tags: [Reports]
 */
 

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
        // console.error(err);
        res.status(500).send('Error retrieving sales report data');
    }
});

router.get("/restockReport", generateRestockReport);

router.patch("/restockInventory", fulfillRestock);


module.exports = router
// vim: tabstop=3
