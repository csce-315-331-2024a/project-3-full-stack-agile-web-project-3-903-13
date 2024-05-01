"use client"

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import MenuAddModal  from "@/components/MenuAddModal";
import MenuUpdateModal from "@/components/MenuUpdateModal";
import MenuRemoveModal from "@/components/MenuRemoveModal";
import axios from "axios";

/**
 * Fetches all menu items from the server.
 * @function
 * @memberOf module:MenuItemPage
 * @returns {JSON} -  An array of menu items.
 */
export const getMenuItems = async () => {
  try {
    const response = await axios.get("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems");
    return response.data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    throw error;
  }
};

  /**
   * Fetches the ingredients for a specified menu item.
   * @function
   * @memberOf module:MenuItemPage
   * @param {Object} menuItem - The menu item object containing parameters to form the query string.
   * @returns {JSON} An array of ingredients that correspond to a menu item.
   */
export const getMenuItemIngredients = async (menuItem) => {
  try {
    const queryString = new URLSearchParams(menuItem).toString();
    const url = `https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/getIngreds?${queryString}`;
    const response = await axios.get(url);

    if (!response.status === 200) {
      throw new Error(response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching ingredient for menu item:", error);
    throw error;
  }
};

  /**
   * Fetches the menu item and the corresponding ingredients.
   * @function
   * @memberOf module:MenuItemPage
   * @returns {JSON} An array of the menu item and its ingredients.
   */
export const getMenuItemsWithIngredients = async () => {
  try {
    const itemsResponse = await axios.get("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems");
    const data = itemsResponse.data;

    const menuItemsWithIngredients = await Promise.all(
      data.map(async (menuItem) => {
        console.log(menuItem.itemname);
        const ingredients = await getMenuItemIngredients({ itemName: menuItem.itemname });
        return { ...menuItem, ingredients };
      })
    );

    return menuItemsWithIngredients;
  } catch (error) {
    console.error("Error fetching menu items with ingredients:", error);
    throw error;
  }
};

  /**
   * Fetches the inventory items.
   * @function
   * @memberOf module:MenuItemPage
   * @returns {JSON} An array of the inventory items.
   */
export const getInventoryItems = async () => {
  try {
    const response = await axios.get("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory");
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw error;
  }
};

const categories = [
  { label: "Burgers/Sandwiches", value: 0 },
  { label: "Corn Dogs/Hot Dogs", value: 1 },
  { label: "Chicken Tenders", value: 2 },
  { label: "French Fries", value: 3 },
  { label: "Shakes/Ice Cream", value: 4 },
  { label: "Beverages", value: 5 },
  { label: "Seasonal", value: 6 },
];

const dietCategories = [
  { label: "None", value: 0 },
  { label: "Vegetarian", value: 1 },
  { label: "Pescatarian", value: 2 },
  { label: "Both", value: 3 },
];

/**
 * Represents the main manager interface for managing menu items in the application.
 * This page allows for adding, updating, and removing menu items and their ingredients.
 * It fetches and displays menu items along with their details such as price, category, and ingredients.
 * Managers can interact with different aspects of the menu through modals for adding, updating, and removing items.
 * @module MenuItemPage
 */
export default function ManagerPage() {
  const [menuItems, setMenuItems] = useState([]);  
  const [ingredients, setIngredients] = useState([]); // State variable for ingredients
  const [initialInventoryItems, setInitialInventoryItems] = useState([]); // Add this line
  const [updateIngred, setUpdateIngred] = useState([]); // State variable for ingredients
  const [inventoryItems, setInventoryItems] = useState(
    initialInventoryItems.map(item => ({ ...item, disabled: false }))
  ); // Initialize inventoryItems with disabled property
  const [isSeasonal, setIsSeasonal] = useState(false); // State for seasonal checkbox
  const [expirationDate, setExpirationDate] = useState(""); // State for expiration date
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [menuItemsGrid, setMenuItemsGrid] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);

  useEffect(() => {
    fetchMenuItems();
    fetchInventoryItems();
    fetchMenuItemsWithIngredients();
  }, []);

  /**
   * Fetches the menu items from the API and updates the menuItems state.
   * It is an async function called within a useEffect to update component state with fetched data.
   * @memberOf module:MenuItemPage
   */
  const fetchMenuItems = async () => {
    try {
      const data = await getMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  /**
   * Fetches the menu items with their ingredients from the API and updates the menuItemsGrid state.
   * It is an async function that uses `getMenuItemsWithIngredients` to fetch detailed data.
   * @memberOf module:MenuItemPage
   */
  const fetchMenuItemsWithIngredients = async () => {
    try {
      const data = await getMenuItemsWithIngredients();
      setMenuItemsGrid(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching menu items with ingredients:", error);
    }
  };

  /**
   * Fetches the inventory items from the API and updates the inventoryItems state.
   * It is an async function called within a useEffect to update component state with fetched data.
   * @memberOf module:MenuItemPage
   */
  const fetchInventoryItems = async () => {
    try {
      const data = await getInventoryItems();
      setInventoryItems(data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  /**
   * Gets the Category Label from the database
   * @returns {number} - A number that corresponds to the category label
   * @memberOf module:MenuItemPage
   */
  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : "Unknown";
  };

  /**
   * Gets the Diet Category Label from the database
   * @returns {number} - A number that corresponds to the diet category label
   * @memberOf module:MenuItemPage
   */
  const getDietCategoryLabel = (categoryValue) => {
    const category = dietCategories.find(cat => cat.value === categoryValue);
    return category ? category.label : "Unknown";
  };

  /**
   * Opens the modal for adding a new menu item by setting the showAddPopup state to true.
   * @memberOf module:MenuItemPage
   */
  const handleShowAddPopup = () => setShowAddPopup(true);
  /**
   * Closes the modal for adding a new menu item by setting the showAddPopup state to false.
   * @memberOf module:MenuItemPage
   */
  const handleHideAddPopup = () => setShowAddPopup(false);
  /**
   * Opens the modal for updating a menu item by setting the showUpdatePopup state to true.
   * @memberOf module:MenuItemPage
   */
  const handleShowUpdatePopup = () => setShowUpdatePopup(true);
  /**
   * Closes the modal for updating a menu item by setting the showUpdatePopup state to false.
   * @memberOf module:MenuItemPage
   */
  const handleHideUpdatePopup = () => setShowUpdatePopup(false);
  /**
   * Opens the modal for removing a menu item by setting the showRemovePopup state to true.
   * @memberOf module:MenuItemPage
   */
  const handleShowRemovePopup = () => setShowRemovePopup(true);
  /**
   * Closes the modal for removing a menu item by setting the showRemovePopup state to false.
   * @memberOf module:MenuItemPage
   */
  const handleHideRemovePopup = () => setShowRemovePopup(false);


  const getAllergyLabel = (categoryValue) => {
    if (categoryValue == 0) {
      return "Yes";
    } else {
      return "No";
    }
  };
  
  /**
   * Handles the selection of an ingredient from the inventory items dropdown.
   * Updates the ingredients array in the state based on the selection.
   * @memberOf module:MenuItemPage
   * @param {Event} e - The event object from the select input.
   * @param {number} index - The index of the ingredient being updated in the ingredients array.
   */
  const handleIngredientSelection = (e, index) => {
    const selectedInventoryItem = inventoryItems.find(item => item.ingredientname === e.target.value);
    if (selectedInventoryItem) {
      // Check if the selected inventory item is already used in another ingredient
      const isAlreadyUsed = ingredients.some((ingredient, i) => i !== index && ingredient.name === selectedInventoryItem.ingredientname);
      if (isAlreadyUsed) {
        alert("This inventory item is already selected in another ingredient. Please choose a different one.");
        return;
      }

      const updatedIngredients = [...ingredients];
      updatedIngredients[index] = { inventID: selectedInventoryItem.inventid, name: selectedInventoryItem.ingredientname, quantity: 1 };
      setIngredients(updatedIngredients);

      // Disable the selected option in the dropdown
      const updatedInventoryItems = inventoryItems.map(item => {
        if (item.ingredientname === e.target.value) {
          return { ...item, disabled: true };
        }
        return item;
      });
      setInventoryItems(updatedInventoryItems);
    }
  };

  /**
   * Updates the quantity of an ingredient in the ingredients array.
   * @memberOf module:MenuItemPage
   * @param {Event} e - The event object from the quantity input field.
   * @param {number} index - The index of the ingredient being updated in the ingredients array.
   */
  const handleQuantityChange = (e, index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].quantity = parseInt(e.target.value);
    setIngredients(updatedIngredients);
  };

  /**
   * Adds a new ingredient to the ingredients array with default values.
   * @memberOf module:MenuItemPage
   */
  const addIngredient = () => {
    setIngredients([...ingredients, { inventID: null, name: "", quantity: 1 }]);
  };

  /**
   * Removes an ingredient from the ingredients array at the specified index.
   * @memberOf module:MenuItemPage
   * @param {number} index - The index of the ingredient to remove.
   */
  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold text-center mb-3 py-4" aria-label="Manager Page">
        Menu Hub
      </h1>
      <div className="w-full  max-w-screen-xl mx-auto">
        <div className="flex justify-evenly mb-8">
        <button onClick={handleShowAddPopup} className="bg-red-800 text-white rounded px-4 py-2 hover:bg-red-700" aria-label="Add Menu Item">
          Add Menu Item
        </button>
        <button onClick={handleShowUpdatePopup} className="bg-red-800 text-white rounded px-4 py-2 hover:bg-red-700" aria-label="Update Menu Item">
          Update Menu Item
        </button>
        <button onClick={handleShowRemovePopup} className="bg-red-800 text-white rounded px-4 py-2 hover:bg-red-700"aria-label="Remove Menu Item">
          Remove Menu Item
        </button>
        </div>
        <div className="grid grid-cols-4 gap-4" aria-label="Menu Items">
          {menuItemsGrid.map((item) => (
            <div
              key={item.menuid}
              className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {item.itemname}
              </h5>
              <p className="mb-4 p-2 bg-gray-200 rounded-lg border border-gray-900">Price: {item.price}</p>
              <p className=" mb-4 p-2 bg-gray-200 rounded-lg border border-gray-900">Category: {getCategoryLabel(item.category)}</p>
              <p className="mb-4 p-2 bg-gray-200 rounded-lg border border-gray-900">Description: {item.description}</p>
              <p className="mb-4 p-2 bg-gray-200 rounded-lg border border-gray-900">Calories: {item.Calories}</p>
              <p className=" mb-4 p-2 bg-gray-200 rounded-lg border border-gray-900">Special Diet: {getDietCategoryLabel(item.specialdiet)}</p>
              <p className=" mb-4 p-2 bg-gray-200 rounded-lg border border-gray-900">Gluten Free: {getAllergyLabel(item.allergy)}</p>
              <div className="p-2 pt-1 bg-gray-200 rounded-lg border border-gray-900">
                <h6 className=" mb-2 text-lg font-semibold">Ingredients:</h6>
                <ul>
                  {item.ingredients.map((ingredient, index) => {
                    return (
                      <li key={index}>
                        {ingredient.ingredientname}: {ingredient.quantity}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <MenuAddModal 
        onClose = {handleHideAddPopup}   
        isOpen = {showAddPopup}   
        menuItems = {menuItems}
        setMenuItems = {setMenuItems}
        inventoryItems = {inventoryItems}
        setInventoryItems={setInventoryItems}
        menuItemsGrid = {menuItemsGrid}
        setMenuItemsGrid = {setMenuItemsGrid}
      />
      <MenuUpdateModal 
        onClose = {handleHideUpdatePopup}
        isOpen = {showUpdatePopup}
        menuItems = {menuItems}
        setMenuItems = {setMenuItems}
        inventoryItems = {inventoryItems}
        setInventoryItems = {setInventoryItems}
        menuItemsGrid = {menuItemsGrid}
        setMenuItemsGrid = {setMenuItemsGrid}
      />
      <MenuRemoveModal 
        onClose = {handleHideRemovePopup}
        isOpen = {showRemovePopup}
        menuItems = {menuItems}
        setMenuItems = {setMenuItems}
        inventoryItems = {inventoryItems}
        menuItemsGrid = {menuItemsGrid}
        setMenuItemsGrid = {setMenuItemsGrid}
      />
    </main>
  );
}
``
