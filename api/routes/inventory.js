const express = require('express')
const router = express.Router()

const inventoryController = require('../services/inventory.js')

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: API for managing Rev's inventory
 * /inventory:
 *   get:
 *     summary: Get list of all inventory items
 *     tags: [Inventory]
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
 * /inventory/usage:
 *   get:
 *     summary: Genarate report regarding inventory usage during a given time period
 *     tags: [Inventory]
 * /inventory/state:
 *   get:
 *     summary: Get list of all inventory items
 *     tags: [Inventory]
 * /inventory/updateQuantity:
 *   patch:
 *     summary: Update the quantity of a given inventory item
 *     tags: [Inventory]
 * /inventory/updatePrice:
 *   patch:
 *     summary: Update the price of a given inventory item
 *     tags: [Inventory]
 * /inventory/updateMinCount:
 *   patch:
 *     summary: Update the minimum count of a given inventory item
 *     tags: [Inventory]
 */

// CREATE new Inventory Item
router.post("/", inventoryController.addInventoryItem)


// Used for features - Excess report and Inventory Usage Report
router.get('/usage', async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        res.status(400).send("Please provide both start and end dates.");
        return;
    }

    try {
        const reportData = await inventoryController.getInventoryUsage(startDate, endDate);
        res.status(200).json(reportData);
    } catch (err) {
        // console.error(err);
        res.status(500).send('Error retrieving inventory usage data');
    }
});
router.get('/state', inventoryController.getInventoryState)


// READ existing attributes 
router.get("/", inventoryController.getInventoryItems)

// UPDATE existing attributes
router.patch("/updateQuantity", inventoryController.updateInventItemQuant)
router.patch("/updatePrice", inventoryController.updateInventItemPrice)
router.patch("/updateMinCount", inventoryController.updateInventItemMin)

// DELETE existing inventory item
router.delete("/", inventoryController.removeInventoryItem)

module.exports = router
