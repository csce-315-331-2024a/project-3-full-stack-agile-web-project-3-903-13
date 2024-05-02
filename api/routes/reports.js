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
 *
 * /reports/whatSellsTogether:
 *   post:
 *     summary: Generate the "What Sells Together" report given a start date and an end date
 *     tags: [Reports]
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
 *                 description: Start date for the report period
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date for the report period
 *     responses:
 *       200:
 *         description: Successfully generated report
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   m1name:
 *                     type: string
 *                     description: Name of the first menu item
 *                   m2name:
 *                     type: string
 *                     description: Name of the second menu item
 *                   paircount:
 *                     type: integer
 *                     description: Count of how often these two items were sold together
 *       500:
 *         description: Internal server error
 * 
 * /reports/salesReport:
 *   get:
 *     summary: Generate the Sales report given a start date and an end date
 *     tags: [Reports]
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
 *                 description: Start date for the report period
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: End date for the report period
 *     responses:
 *       200:
 *         description: Sales report generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   itemName:
 *                     type: string
 *                     description: Name of the menu item.
 *                   quantity_sold:
 *                     type: integer
 *                     description: Total quantity of the item sold during the specified period.
 *                   total_sales:
 *                     type: number
 *                     format: float
 *                     description: Total revenue generated from the item during the specified period.
 *       400:
 *         description: Invalid request parameters. Both start date and end date are required.
 *       500:
 *         description: Internal Server Error
 * 
 * /reports/restockReport:
 *   get:
 *     summary: Generate the "Restock" report to identify inventory items below minimum count
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Restock report generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   itemName:
 *                     type: string
 *                     description: Name of the inventory item.
 *                   count:
 *                     type: integer
 *                     description: Current count of the item.
 *                   mincount:
 *                     type: integer
 *                     description: Minimum required count for the item.
 *       500:
 *         description: Internal Server Error
 *
 * /reports/restockInventory:
 *   patch:
 *     summary: Updates the quantity of all the inventory items that are below the minimum count
 *     tags: [Reports]
 *     description: This endpoint automatically replenishes inventory items that have fallen below the minimum required count by doubling their current count.
 *     responses:
 *       200:
 *         description: Inventory successfully updated for restock.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message indicating the operation result.
 *                 affectedRows:
 *                   type: integer
 *                   description: Number of rows affected by the update operation.
 *       500:
 *         description: Internal Server Error
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
