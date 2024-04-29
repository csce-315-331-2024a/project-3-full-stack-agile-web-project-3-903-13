const express = require('express')
const router = express.Router()
const menuItemsController = require('../services/menuitems')

// CREATE a NEW Menu Item
router.post("/", menuItemsController.addMenuItem);

// READ existing menuItems and ingredients
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
