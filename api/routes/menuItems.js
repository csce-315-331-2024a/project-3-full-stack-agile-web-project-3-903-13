/**
 * @file This file contains API endpoints relating to menu items
*/
const express = require('express')
const router = express.Router()
const menuItemsController = require('../services/menuitems')

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
 *	      500:
 *	        description: Internal Server Error
 *	  post:
 *	    summary: Add a new menu item to the database
 *	    tags: [Menu Items]
 *	    responses:
 *	      200:
 *	        description: 
 *	      500:
 *	        description: Internal Server Error
 *	/menuitems/getIngreds:
 *	  get:
 *	    summary: Get list of ingredients of a given menu item
 *	    tags: [Menu Items]
 *	/menuitems/seasonal:
 *	  get:
 *	    summary: Get list of ingredients of a given menu item
 *	    tags: [Menu Items]
 *	/menuitems/specific:
 *	  get:
 *	    summary: Gets the details of a menu item given its name
 *	    tags: [Menu Items]
 *	/menuitems/updatePrice:
 *	  patch:
 *	    summary: Get list of ingredients of a given menu item
 *	    tags: [Menu Items]
 *	/menuitems/updateCat:
 *	  patch:
 *	    summary: Get list of ingredients of a given menu item
 *	    tags: [Menu Items]
 *	/menuitems/updateIngred:
 *	  patch:
 *	    summary: Get list of ingredients of a given menu item
 *	    tags: [Menu Items]
 *	/menuitems/updateDesc:
 *	  patch:
 *	    summary: Get list of ingredients of a given menu item
 *	    tags: [Menu Items]
 *	/menuitems/updateCal:
 *	  patch:
 *	    summary: Get list of ingredients of a given menu item
 *	    tags: [Menu Items]
 *	/menuitems/updateDiet:
 *	  patch:
 *	    summary: Get list of ingredients of a given menu item
 *	    tags: [Menu Items]
 *	/menuitems/updateAller:
 *	  patch:
 *	    summary: Get list of ingredients of a given menu item
 *	    tags: [Menu Items]
 */


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
