const express = require('express')
const router = express.Router()

const inventoryController = require('../services/inventory.js')


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

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: API for managing Rev's inventory
 * /inventory:
 *   get:
 *     summary: Get list of all inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: List of all inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   inventid:
 *                     type: integer
 *                     description: The ID of the inventory item
 *                   ingredientname:
 *                     type: string
 *                     description: The name of the inventory item
 *                   count:
 *                     type: integer
 *                     description: The current count of the inventory item
 *                   price:
 *                     type: number
 *                     description: The price of the inventory item
 *                   mincount:
 *                     type: integer
 *                     description: The minimum count of the inventory item
 *       500:
 *         description: Internal Server Error
 *   post:
 *     summary: Create a new inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 description: The name of the inventory item to add
 *               count:
 *                 type: integer
 *                 description: The count of the inventory item
 *               price:
 *                 type: number
 *                 description: The price of the inventory item
 *               mincount:
 *                 type: integer
 *                 description: The minimum count of the inventory item
 *     responses:
 *       201:
 *         description: Inventory item added successfully
 *       401:
 *         description: Item already exists
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete an inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 description: The name of the inventory item to remove
 *     responses:
 *       200:
 *         description: Inventory item removed successfully
 *       404:
 *         description: Inventory item not found
 *       500:
 *         description: Internal Server Error
 * /inventory/usage:
 *   get:
 *     summary: Gets the inventory usage of all ingredients between a provided start and end date
 *     tags: [Inventory]
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description: The start date of the period to retrieve inventory usage for (YYYY-MM-DD)
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: The end date of the period to retrieve inventory usage for (YYYY-MM-DD)
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Inventory usage data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the inventory item
 *                   totalinventoryused:
 *                     type: string
 *                     description: The total quantity of the inventory item used within the specified period
 *       400:
 *         description: Please provide both start and end dates
 *       500:
 *         description: Error retrieving inventory usage data
 * 
 * /inventory/state:
 *   get:
 *     summary: Gets the state of the inventory at a given time, i.e., the quantity of all ingredients on that day
 *     tags: [Inventory]
 *     parameters:
 *       - name: startDate
 *         in: query
 *         description: The date for which the inventory state is to be retrieved (YYYY-MM-DD)
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Inventory state retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the inventory item
 *                   inventorybegin:
 *                     type: string
 *                     description: The quantity of the inventory item available at the specified date
 *       500:
 *         description: Error retrieving inventory state
 * /inventory/updateQuantity:
 *   patch:
 *     summary: Update the quantity of a given inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 description: The name of the inventory item to update
 *               newCount:
 *                 type: integer
 *                 description: The new count of the inventory item
 *     responses:
 *       202:
 *         description: Quantity of the inventory item updated successfully
 *       401:
 *         description: Item doesn't exist
 *       500:
 *         description: Internal Server Error
 * /inventory/updatePrice:
 *   patch:
 *     summary: Update the price of a given inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 description: The name of the inventory item to update
 *               newPrice:
 *                 type: number
 *                 description: The new price of the inventory item
 *     responses:
 *       202:
 *         description: Price of the inventory item updated successfully
 *       401:
 *         description: Item doesn't exist
 *       500:
 *         description: Internal Server Error
* /inventory/updateMinCount:
 *   patch:
 *     summary: Update the minimum count of a given inventory item
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 description: The name of the inventory item to update
 *               newMinCount:
 *                 type: integer
 *                 description: The new minimum count of the inventory item
 *     responses:
 *       202:
 *         description: Minimum count of the inventory item updated successfully
 *       401:
 *         description: Item doesn't exist
 *       500:
 *         description: Internal Server Error
 */
