/**
 * @file This file contains API endpoints relating to menu items
*/
const express = require('express')
const router = express.Router()
const menuItemsController = require('../services/menuitems')

router.post("/", menuItemsController.addMenuItem);
router.get("/", menuItemsController.retrieveMenuItems);
router.get("/getIngreds", menuItemsController.retrieveMenuItemIngredients);
router.get("/seasonal", menuItemsController.retrieveSeasonalInfo);
router.get("/specific", menuItemsController.getDetails)

// UPDATE various attributes
router.patch("/updatePrice", menuItemsController.updateMenuItemPrice);
router.patch("/updateCat", menuItemsController.updateMenuItemCat);
router.patch("/updateIngred", menuItemsController.updateMenuItemIngred);
router.patch("/updateDesc", menuItemsController.updateMenuItemDescription);
router.patch("/updateCal", menuItemsController.updateMenuItemCalories);
router.patch("/updateDiet", menuItemsController.updateMenuItemDiet);
router.patch("/updateAller", menuItemsController.updateMenuItemAllergy);

// DELETE a menu item
router.delete("/", menuItemsController.removeMenuItem);


module.exports = router
// vim: tabstop=3


/**
 * @swagger
 * tags:
 *   name: Menu Items
 *   description: API for managing Rev's menu items
 *	/menuitems:
 *	  get:
 *	    summary: Get list of all menu items at Rev's
 *	    tags: [Menu Items]
 *	    responses:
 *	      200:
 *	        description: List of all menu items at Rev's
 *	        content:
 *	          application/json:
 *	            schema: 
 *	              type: array
 *	            example:
 *	              menuid: 7
 *	              itemname: Revs Grilled Chicken Sandwich
 *	              price: 8.39
 *	              category: 0
 *	              description: Marinated juicy chicken breast serverd on a toasted bun and topped with veggies
 *	              Calories: 400
 *	              specialdiet: 0
 *	              allergy: 1
 *	      500:
 *	        description: Internal Server Error
 *	  post:
 *	    summary: Add a new menu item to the database
 *	    tags: [Menu Items]
 *	    requestBody:
 *	      required: true
 *	      content:
 *	        application/json:
 *	          example:
 *	            itemname: Revs Special Item 
 *	            price: 9.99
 *	            category: 0
 *	            isSeasonal: false
 *	            expirationDate: 12/25/3000
 *	            description: Descriptive summary of item
 *	            Calories: 900
 *	            specialdiet: 0
 *	            allergy: 1 
 *	            
 *	    responses:
 *	      201:
 *	        description: Menu item added successfully
 *	      401:
 *	        description: Item already exists
 *	      500:
 *	        description: Internal Server Error
 *	/menuitems/getIngreds:
 *	  get:
 *	    summary: Get list of ingredients of a given menu item
 *	    tags: [Menu Items]
 *	    parameters:
 *	      - in: path
 *	        name: itemName
 *	        required: true
 *	    responses:
 *	      200:
 *	        description: List of ingredients for given menu item
 *	        content: 
 *	          application/json:
 *	            example: 
 *	              inventid: 1
 *	              ingredientname: Beef Patties
 *	              count: 1360
 *	              price: 3
 *	              mincount: 500
 *	              quantity: 1
 *	      400:
 *	        description: Query Failed
 *	      401:
 *	        description: Item doesn't exist
 *	      500:
 *	        description: Internal Server Error
 *	/menuitems/seasonal:
 *	  get:
 *	    summary: Get information about a given seasonal menu item
 *	    tags: [Menu Items]
 *	    parameters:
 *	      - in: path
 *	        name: itemName
 *	        required: true
 *	    responses:
 *	      200:
 *              description: Menu ID and Expiration Date of seasonal menu item
 *              content:
 *                application/json:
 *                  example:
 *                    menuid: 2
 *                    expirationdate: 12/25/2025
 *	      400:
 *              description: Query Failed
 *	      401:
 *              description: Item Doesn't exist
 *	      500:
 *              description: Internal Server Error
 * /menuitems/specific:
 *   get:
 *     summary: Gets the details of a menu item given its name
 *     tags: [Menu Items]
 *     parameters:
 *       - name: name
 *         in: query
 *         description: The name of the menu item to retrieve details for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the menu item retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   menuid:
 *                     type: integer
 *                     description: The ID of the menu item
 *                   itemname:
 *                     type: string
 *                     description: The name of the menu item
 *                   price:
 *                     type: number
 *                     description: The price of the menu item
 *                   category:
 *                     type: integer
 *                     description: The category ID of the menu item
 *                   description:
 *                     type: string
 *                     description: The description of the menu item
 *                   calories:
 *                     type: integer
 *                     description: The calorie count of the menu item
 *                   specialdiet:
 *                     type: integer
 *                     description: The special diet ID of the menu item
 *                   allergy:
 *                     type: integer
 *                     description: The allergy ID of the menu item
 *       500:
 *         description: Internal Server Error
 * /menuitems/updateCat:
 *   patch:
 *     summary: Update the category of a menu item
 *     tags: [Menu Items]
 *     requestBody:
 *       require: true
 *       content:
 *         application/json:
 *           example:
 *             itemName: Cheeseburger
 *             newCat: 2
 *     responses:
 *       202:
 *         description: Category of {ItemName} updated successfully
 *       401:
 *         description: Item Doesn't exist
 *       500:
 *         description: Internal Server Error
 * /menuitems/updatePrice:
 *   patch:
 *     summary: Update price of a given menu item
 *     tags: [Menu Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             itemName: Cheeseburger
 *             newPrice: 10.99
 *     responses:
 *       202:
 *         description: Price of {itemName} updated successfully
 *       401:
 *         description: Item Doesn't exist
 *       500:
 *         description: Internal Server Error
 * /menuitems/updateIngred:
 *   patch:
 *     summary: Update ingredient list for a particular menu item
 *     tags: [Menu Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             itemName: CheeseBurger
 *             ingredients:
 *               [ 
 *                 {
 *                   inventID: 1,
 *                   name: patty,
 *                   quantity: 2
 *                 },
 *                 {
 *                   inventID: 2,
 *                   name: lettuce,
 *                   quantity: 1
 *                 }
 *               ] 
 *     responses:
 *       202:
 *         description: Ingredients of {ItemName} updated successfully
 *       401:
 *         description: Item Doesn't exist
 *       500:
 *         description: Internal Server Error
 * /menuitems/updateDesc:
 *   patch:
 *     summary: Update the description of a particular menu item
 *     tags: [Menu Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             itemName: Cheeseburger
 *             newDes: Absolutely delicious cheeseburger!
 *     responses:
 *       202:
 *         description: Description of {ItemName} updated successfully
 *       401:
 *         description: Item Doesn't exist
 *       500:
 *         description: Internal Server Error
 * /menuitems/updateCal:
 *   patch:
 *     summary: Update the calorie count for a particular menu item
 *     tags: [Menu Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             itemName: Cheeseburger
 *             newCalories: 990
 *     responses:
 *       202:
 *         description: Calories of {ItemName} updated successfully
 *       401:
 *         description: Item Doesn't exist
 *       500:
 *         description: Internal Server Error
 * /menuitems/updateDiet:
 *   patch:
 *     summary: Update the special diet flag for a particular menu item
 *     tags: [Menu Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             itemName: Cheeseburger
 *             newDiet: 3
 *     responses:
 *       202:
 *         description: Special Diet of {ItemName} updated successfully
 *       401:
 *         description: Item Doesn't exist
 *       500:
 *         description: Internal Server Error
 * /menuitems/updateAller:
 *   patch:
 *     summary: Update the allergy flag for a particular menu item
 *     tags: [Menu Items]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           example:
 *             itemName: Cheeseburger
 *             newAllergy: 1
 *     responses:
 *       202:
 *         description: Allergy of {ItemName} updated successfully
 *       401:
 *         description: Item Doesn't exist
 *       500:
 *         description: Internal Server Error
 */
