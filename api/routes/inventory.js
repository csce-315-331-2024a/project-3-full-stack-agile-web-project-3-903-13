const express = require('express')
const router = express.Router()
const { getInventoryUsage } = require('../services/inventoryUsage');
const {getInventoryState} = require('../services/excessReport');

router.get('/usage', async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        res.status(400).send("Please provide both start and end dates.");
        return;
    }

    try {
        const reportData = await getInventoryUsage(startDate, endDate);
        res.status(200).json(reportData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving inventory usage data');
    }
});

router.get('/state', getInventoryState)
const inventoryItemsController = require('../services/inventory.js')

router.get("/", inventoryItemsController.retrieveInventoryItems)

module.exports = router
// vim: tabstop=3
