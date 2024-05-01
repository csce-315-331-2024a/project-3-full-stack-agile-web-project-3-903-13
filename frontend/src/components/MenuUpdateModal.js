/**
 * @module MenuUpdateModal
 */
import React, {useState, useEffect} from 'react';
import { FaTrash } from "react-icons/fa";
import axios from 'axios';

/**
 * Fetches all menu items from the server.
 * @function
 * @memberOf module:MenuUpdateModal
 * @returns {JSON} -  An array of menu items.
 */
export const getMenuItems = async () => {
  try {
    const response = await axios.get("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems");
    return response.data;
  } catch (error) {
    // Handle error if needed
    console.error("Error fetching menu items:", error);
    throw error;
  }
};
  
  /**
   * Fetches the ingredients for a specified menu item.
   * @function
   * @memberOf module:MenuUpdateModal
   * @param {Object} menuItem - The menu item object containing parameters to form the query string.
   * @returns {JSON} An array of ingredients that correspond to a menu item.
   */
 export const getMenuItemIngredients = async (menuItem) => {
  try {
    // Construct the query string from the menuItem object
    const queryString = new URLSearchParams(menuItem).toString();

    // Append the query string to the URL
    const url = `https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/getIngreds?${queryString}`;

    // Make the GET request using Axios
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    // Handle error if needed
    console.error("Error fetching ingredient for menu item:", error);
    throw error;
  }
};
  
  /**
   * Fetches the menu item and the corresponding ingredients.
   * @function
   * @memberOf module:MenuUpdateModal
   * @returns {JSON} An array of the menu item and its ingredients.
   */
export const getMenuItemsWithIngredients = async () => {
  try {
    // Fetch menu items
    const itemsResponse = await axios.get("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems");
    const itemsData = itemsResponse.data;

    // Fetch ingredients for each menu item
    const menuItemsWithIngredients = await Promise.all(
      itemsData.map(async (menuItem) => {
        console.log(menuItem.itemname);

        // Fetch ingredients for the current menu item
        const ingredientsResponse = await axios.get(`https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/getIngreds?itemName=${menuItem.itemname}`);
        const ingredientsData = ingredientsResponse.data;

        // Return the menu item with its ingredients
        return { ...menuItem, ingredients: ingredientsData };
      })
    );

    return menuItemsWithIngredients;
  } catch (error) {
    // Handle error if needed
    console.error("Error fetching menu items with ingredients:", error);
    throw error;
  }
};

  /**
   * Fetches the inventory items.
   * @function
   * @memberOf module:MenuUpdateModal
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

  /**
   * Updates the price of a specified menu item on the server.
   * @function
   * @param {Object} menuItem - The menu item object containing the new price and item identifier.
   * @returns {string} A success message if the update is successful.
   */
export const updateMenuItemPrice = async (menuItem) => {
  try {
    const response = await axios.patch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/updatePrice", menuItem, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return { success: true, message: "Menu item price updated successfully" };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error("Network error occurred, please try again later.");
    } else {
      throw new Error("An unexpected error occurred, please try again later.");
    }
  }
};
  
  /**
   * Updates the category of a specified menu item on the server.
   * @function
   * @param {Object} menuItem - The menu item object containing the new category and item identifier.
   * @returns {string} A success message if the update is successful.
   */
export const updateMenuItemCat = async (menuItem) => {
  try {
    const response = await axios.patch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/updateCat", menuItem, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return { success: true, message: "Menu item category updated successfully" };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error("Network error occurred, please try again later.");
    } else {
      throw new Error("An unexpected error occurred, please try again later.");
    }
  }
};
  
  /**
   * Updates the ingredients of a specified menu item on the server.
   * @function
   * @param {Object} menuItem - The menu item object containing the new ingredients and item identifier.
   * @returns {string} A success message if the update is successful.
   */
export const updateMenuItemIngred = async (menuItem) => {
  try {
    const response = await axios.patch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/updateIngred", menuItem, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return { success: true, message: "Menu item ingredients updated successfully" };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error("Network error occurred, please try again later.");
    } else {
      throw new Error("An unexpected error occurred, please try again later.");
    }
  }
};
  
  /**
   * Updates the description of a specified menu item on the server.
   * @function
   * @param {Object} menuItem - The menu item object containing the new description and item identifier.
   * @returns {string} A success message if the update is successful.
   */
export const updateMenuItemDesc = async (menuItem) => {
  try {
    const response = await axios.patch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/updateDesc", menuItem, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return { success: true, message: "Menu item description updated successfully" };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error("Network error occurred, please try again later.");
    } else {
      throw new Error("An unexpected error occurred, please try again later.");
    }
  }
};
  
  /**
   * Updates the calories of a specified menu item on the server.
   * @function
   * @param {Object} menuItem - The menu item object containing the new calories and item identifier.
   * @returns {string} A success message if the update is successful.
   */
export const updateMenuItemCalories = async (menuItem) => {
  try {
    const response = await axios.patch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/updateCal", menuItem, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return { success: true, message: "Menu item calories updated successfully" };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error("Network error occurred, please try again later.");
    } else {
      throw new Error("An unexpected error occurred, please try again later.");
    }
  }
};
  
  /**
   * Updates the special diet of a specified menu item on the server.
   * @function
   * @param {Object} menuItem - The menu item object containing the new special diet and item identifier.
   * @returns {string} A success message if the update is successful.
   */
export const updateMenuItemDiet = async (menuItem) => {
  try {
    const response = await axios.patch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/updateDiet", menuItem, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return { success: true, message: "Menu item diet updated successfully" };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error("Network error occurred, please try again later.");
    } else {
      throw new Error("An unexpected error occurred, please try again later.");
    }
  }
};

  /**
   * Updates the allergy risks of a specified menu item on the server.
   * @function
   * @param {Object} menuItem - The menu item object containing the new allergy risks and item identifier.
   * @returns {string} A success message if the update is successful.
   */
export const updateMenuItemAllergy = async (menuItem) => {
  try {
    const response = await axios.patch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/updateAller", menuItem, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return { success: true, message: "Menu item allergy updated successfully" };
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data);
    } else if (error.request) {
      throw new Error("Network error occurred, please try again later.");
    } else {
      throw new Error("An unexpected error occurred, please try again later.");
    }
  }
};

  const updateCategories = [
    { label: "Update Price", value: 0 },
    { label: "Update Category", value: 1 },
    { label: "Update Ingredients", value: 2 },
    { label: "Update Description", value: 3 },
    { label: "Update Calories", value: 4 },
    { label: "Update Special Diet", value: 5 },
    { label: "Update Allergy", value: 6 },
  ];

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
 * Component for updating menu items in a modal dialog.
 * Provides forms to update various attributes of a menu item, such as price, category, ingredients, description, etc.
 * @param {Object} props - Component props.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {Array} props.menuItems - Array of all menu items.
 * @param {Array} props.inventoryItems - Array of all inventory items.
 * @param {function} props.setMenuItemsGrid - Function to update the grid of menu items.
 */
export default function MenuUpdateModal ({onClose, isOpen, menuItems, inventoryItems, setInventoryItems,  setMenuItemsGrid}){
    const [updateItemName, setUpdateItemName] = useState(""); // Separate state variable for Update Menu Item form
  const [updatePrice, setUpdatePrice] = useState(""); // Separate state variable for Update Menu Item form
  const [updateCat, setUpdateCat] = useState(0); // Separate state variable for Update Menu Item form
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");
  const [ingredients, setIngredients] = useState([]); // State variable for ingredients
  const [initialInventoryItems, setInitialInventoryItems] = useState([]); // Add this line
  const [updateIngred, setUpdateIngred] = useState([]); // State variable for ingredients
  const [isSeasonal, setIsSeasonal] = useState(false); // State for seasonal checkbox
  const [updateCategory, setUpdateCategory] = useState(""); // State for expiration date
  const [updateDescription, setUpdateDescription] = useState(""); // Separate state variable for Add Menu Item form
  const [updateCalories, setUpdateCalories] = useState(""); // Separate state variable for Add Menu Item form
  const [updateDiet, setUpdateDiet] = useState(0); // Separate state variable for Add Menu Item form
  const [updateAllergy, setUpdateAllergy] = useState(false); // Separate state variable for Add Menu Item form
  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  if (!isOpen) return null;


  /**
   * Fetches the list of menu items from the server.
   * @memberOf module:MenuUpdateModal
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
   * Fetches menu items along with their ingredients.
   * @memberOf module:MenuUpdateModal
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
   * Fetches the inventory items from the server.
   * @memberOf module:MenuUpdateModal
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
   * Handles selection changes in the ingredients dropdown.
   * @memberOf module:MenuUpdateModal
   * @param {Event} e - The event object.
   * @param {number} index - The index of the ingredient being updated.
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
   * Handles changes to the quantity of ingredients.
   * @memberOf module:MenuUpdateModal
   * @param {Event} e - The event object.
   * @param {number} index - The index of the ingredient being updated.
   */
  const handleQuantityChange = (e, index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].quantity = parseInt(e.target.value);
    setIngredients(updatedIngredients);
  };

  /**
   * Adds a new ingredient field to the list.
   * @memberOf module:MenuUpdateModal
   */
  const addIngredient = () => {
    setIngredients([...ingredients, { inventID: null, name: "", quantity: 1 }]);
  };

  /**
   * Removes an ingredient from the list.
   * @memberOf module:MenuUpdateModal
   * @param {number} index - The index of the ingredient to remove.
   */
  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  /**
   * Handles updating various attributes of a menu item based on the selected category.
   * @memberOf module:MenuUpdateModal
   * @param {Event} e - The event object.
   */
  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (updateCategory == 0) {
        if (!validatePrice(updatePrice)) {
          setUpdateErrorMessage("Please fill out all fields correctly.");
          return;
        }
        response = await updateMenuItemPrice({ itemName: updateItemName, newPrice: updatePrice });
      } else if (updateCategory == 1) {
        response = await updateMenuItemCat({ itemName: updateItemName, newCat: updateCat });
      } else if (updateCategory == 2) {
        response = await updateMenuItemIngred({ itemName: selectedMenuItem, ingredients: updateIngred });
      } else if (updateCategory == 3) {
        response = await updateMenuItemDesc({ itemName: updateItemName, newDes: updateDescription });
      } else if (updateCategory == 4) {
        if (!validateCalories(updateCalories)) {
          setUpdateErrorMessage("Please fill out all fields correctly.");
          return;
        }
        response = await updateMenuItemCalories({ itemName: updateItemName, newCalories: updateCalories });
      } else if (updateCategory == 5) {
        response = await updateMenuItemDiet({ itemName: updateItemName, newDiet: updateDiet });
      } else if (updateCategory == 6) {
        response = await updateMenuItemAllergy({ itemName: updateItemName, 
          newAllergy: updateAllergy ? 0 : 1 });
      }
      setUpdateSuccessMessage(response.message);
      setUpdateErrorMessage("");
      setUpdateItemName("");
      setUpdatePrice("");
      setUpdateCat(0);
      setUpdateDescription("");
      setUpdateCalories("");
      setUpdateDiet(0);
      setUpdateAllergy(false);
      fetchMenuItems();
      fetchMenuItemsWithIngredients();
    } catch (error) {
      setUpdateErrorMessage(error.message);
    }
  };

  /**
   * Validates the input for item name.
   * @memberOf module:MenuUpdateModal
   * @param {string} itemName - The item name to validate.
   * @returns {boolean} - True if valid, false otherwise.
   */
  const validateItemName = (itemName) => {
    return itemName.trim() !== "";
  };

  /**
   * Validates the input for price.
   * @memberOf module:MenuUpdateModal
   * @param {string} price - The price to validate.
   * @returns {boolean} - True if valid, false otherwise.
   */
  const validatePrice = (price) => {
    return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
  };

  /**
   * Validates the input for calories.
   * @memberOf module:MenuUpdateModal
   * @param {string} calories - The calories to validate.
   * @returns {boolean} - True if valid, false otherwise.
   */
  const validateCalories = (calories) => {
    return !isNaN(parseInt(calories)) && parseInt(calories) >= 0;
  }

  /**
   * Handles changes to the selected ingredient in the update ingredients form.
   * Prevents duplicate selection of the same inventory item and manages state updates for ingredient name changes.
   * @memberOf module:MenuUpdateModal
   * @param {Event} e - The event object from the dropdown selection.
   * @param {number} index - Index of the ingredient being updated in the list.
   */
  const handleUpdateIngredientName = (e, index) => {
    const updatedIngredients = [...updateIngred];
    const selectedInventoryItem = inventoryItems.find(item => item.ingredientname === e.target.value);

    // Check if the selected inventory item is already used in another ingredient
    const isAlreadyUsed = updatedIngredients.some((ingredient, i) => i !== index && ingredient.name === selectedInventoryItem.ingredientname);
    if (isAlreadyUsed) {
      alert("This inventory item is already selected in another ingredient. Please choose a different one.");
      return;
    }

    // Check if the selected inventory item is "Select Inventory Item"
    if (e.target.value === "Select Inventory Item") {
      return; // Do nothing if "Select Inventory Item" is selected
    }

    if (selectedInventoryItem) {
      updatedIngredients[index] = { inventID: selectedInventoryItem.inventid, name: selectedInventoryItem.ingredientname, quantity: updatedIngredients[index].quantity };
      setUpdateIngred(updatedIngredients);
    }
  };

  /**
   * Updates the quantity of an ingredient in the update ingredients form.
   * Ensures that ingredient quantities are correctly managed and state is updated.
   * @memberOf module:MenuUpdateModal
   * @param {Event} e - The event object from the input field for quantity.
   * @param {number} index - Index of the ingredient whose quantity is being updated.
   */
  const handleUpdateIngredientQuantity = (e, index) => {
    const updatedIngredients = [...updateIngred];
    const originalIngredient = updatedIngredients[index]; // Store the original ingredient object
    console.log("Original Ingredient:", originalIngredient);
    updatedIngredients[index] = { ...originalIngredient, quantity: parseInt(e.target.value) };
    console.log("Updated Ingredient:", updatedIngredients[index]);
    setUpdateIngred(updatedIngredients);
  };

  /**
   * Removes an ingredient from the update ingredients list and updates state.
   * Re-enables the removed ingredient in the dropdown for potential re-selection.
   * @memberOf module:MenuUpdateModal
   * @param {number} index - Index of the ingredient to be removed from the list.
   */
  const handleRemoveUpdateIngredient = (index) => {
    const updatedIngredients = [...updateIngred];
    updatedIngredients.splice(index, 1);
    setUpdateIngred(updatedIngredients);

    // Enable the removed inventory item in the dropdown
    const removedIngredient = updateIngred[index];
    const updatedInventoryItems = inventoryItems.map(item => {
      if (item.inventid === removedIngredient.inventID) {
        return { ...item, disabled: false };
      }
      return item;
    });
    setInventoryItems(updatedInventoryItems);
  };

  /**
   * Adds a new ingredient field to the update ingredients list.
   * Ensures no duplicate ingredients are added and manages state for new ingredient fields.
   * @memberOf module:MenuUpdateModal
   */
  const handleAddUpdateIngredientField = () => {
    const selectedInventoryItem = inventoryItems.find(item => !item.disabled); // Find the first enabled inventory item
    if (selectedInventoryItem) {
      // Check if the selected inventory item is already present in updateIngred
      const isAlreadyUsed = updateIngred.some(ingredient => ingredient.inventID === selectedInventoryItem.inventid);
      if (isAlreadyUsed) {
        alert("This inventory item is already selected as an ingredient. Please choose a different one.");
        return;
      }

      setUpdateIngred([...updateIngred, { inventID: selectedInventoryItem.inventid, name: selectedInventoryItem.ingredientname, quantity: 1 }]);
      // Disable the selected option in the dropdown
      const updatedInventoryItems = inventoryItems.map(item => {
        if (item.inventid === selectedInventoryItem.inventid) {
          return { ...item, disabled: true };
        }
        return item;
      });
      setInventoryItems(updatedInventoryItems);
    }
  };

  /**
   * Handles selection of a menu item for updating its ingredients.
   * Fetches existing ingredients for the selected menu item and updates state accordingly.
   * @memberOf module:MenuUpdateModal
   * @param {Event} e - The event object from the dropdown selection.
   */
  const handleMenuItemSelection = async (e) => {
    const selectedMenuItemName = e.target.value;
    console.log(selectedMenuItemName);
    setSelectedMenuItem(selectedMenuItemName);

    try {
      // Fetch ingredients for the selected menu item
      const data = await getMenuItemIngredients({ itemName: selectedMenuItemName });

      // Modify the data to include inventID
      const updatedData = data.map(ingredient => ({ ...ingredient, inventID: ingredient.inventid }));

      setUpdateIngred(updatedData);
      console.log(updatedData);
    } catch (error) {
      console.error("Error fetching ingredients for menu item:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
            <div className="relative max-h-screen overflow-y-auto py-5">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                    <button
                        className="absolute top-5 right-4 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
    <h2 className=" p-3 md:p text-xl font-semibold text-center">UPDATE MENU ITEMS</h2>
    {updateErrorMessage && (
      <p className="text-red-500">{updateErrorMessage}</p>
    )}
    {updateSuccessMessage && (
      <p className="text-green-500">{updateSuccessMessage}</p>
    )}
    <form onSubmit={handleUpdateMenuItem} className="flex flex-col items-center justify-center">
      <select
        value={updateCategory}
        onChange={(e) => setUpdateCategory(parseInt(e.target.value))}
        className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
        required
      >
        {updateCategories.map((cat) => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>
      {(updateCategory < 2 || updateCategory > 2) && (
        <select
         data-testid = "menu select"
          value={updateItemName}
          onChange={(e) => setUpdateItemName(e.target.value)}
          className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
        >
          <option value="">Select Menu Item</option>
          {menuItems.map(item => (
            <option key={item.menuid} value={item.itemname}>{item.itemname}</option>
          ))}
        </select>

      )
      }

      {updateCategory == 0 && (
        <input
          type="number"
          placeholder="New Price"
          value={updatePrice}
          onChange={(e) => setUpdatePrice(e.target.value)}
          className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
          required
        />
      )}
      {updateCategory == 1 && (
        <select
          value={updateCat}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            console.log("Selected Category Value:", value);
            setUpdateCat(value);
          }}
          className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
          required
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>

      )}
      {updateCategory === 2 && (
        <div className="w-full md:w-4/5 flex flex-col items-center justify-center">
          <select
            value={selectedMenuItem}
            onChange={handleMenuItemSelection}
            className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
          >
            <option value="">Select Menu Item</option>
            {menuItems.map(item => (
              <option key={item.menuid} value={item.itemname}>{item.itemname}</option>
            ))}
          </select>
          {/* Display ingredients for the selected menu item */}
          {selectedMenuItem && (
            <div className="flex flex-col items-center justify-center">
              <h3>Ingredients for {selectedMenuItem}</h3>
              {/* Display ingredients using dropdown for ingredient selection */}
              {updateIngred.map((ingredient, index) => (
                <div key={index} className="flex justify-between mb-2">
                  <select
                    value={ingredient.ingredientname} // Use inventoryItem property
                    onChange={(e) => handleUpdateIngredientName(e, index)}
                    className="w-full md:w-1/2 flex flex-col items-center mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-1"
                    required
                  >
                    {inventoryItems.map((inventoryItem, idx) => (
                      <option key={inventoryItem.inventid} value={inventoryItem.ingredientname}>{inventoryItem.ingredientname}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleUpdateIngredientQuantity(e, index)}
                    className="w-full md:w-1/4 flex flex-col items-center mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-1 py-1"
                    required
                  />
                  <button type="button" className=" mb-2 flex flex-col items-center bg-red-800 text-white rounded px-4 py-2" onClick={() => handleRemoveUpdateIngredient(index)}>
                    <FaTrash />
                  </button>
                </div>
              ))}
              {/* Add ingredient button */}
              <button type="button" className="mb-4 bg-gray-500 text-white rounded px-2 py-1 flex flex-col items-center" onClick={handleAddUpdateIngredientField}>Add Ingredient</button>
            </div>
          )}
        </div>
      )}
      {updateCategory == 3 && (
        <textarea
          type="text"
          placeholder="Description"
          value={updateDescription}
          onChange={(e) => setUpdateDescription(e.target.value)}
          className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5 resize:vertical"
          required
        />
      )}
      {updateCategory == 4 && (
        <input
          type="number"
          placeholder="New Calories"
          value={updateCalories}
          onChange={(e) => setUpdateCalories(e.target.value)}
          className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
          required
        />
      )}
      {updateCategory == 5 && (
        <select
          value={updateDiet}
          onChange={(e) => setUpdateDiet(parseInt(e.target.value))}
          className="mb-1 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
        >
          {dietCategories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      )}
      {updateCategory == 6 && (
        <div className="flex justify-between items-center mb-2 bg-white shadow-input outline-none border focus:border-red-800 rounded-lg px-2 py-2.5 ">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={updateAllergy}
              onChange={(e) => setUpdateAllergy(e.target.checked)}
              className={`mb-1.5 px-4 justify-center items-center accent-red-800 form-checkbox h-4 w-5`}
            />
            <label className="ml-1 mb-2 justify-centere items-center">
              Gluten Free
            </label>
          </div>
        </div>
      )}
      <button type="submit" className="bg-red-800 text-white rounded px-4 py-2">UPDATE</button>
    </form>
  </div>
  </div>
  </div>
  );
}