/**
 * @module MenuAddModal
 */
import React, { useState, useEffect } from 'react';
import { FaTrash } from "react-icons/fa";
import axios from 'axios';

/**
 * Fetches all menu items from the API.
 * @function
 * @memberOf module:MenuAddModal
 * @returns {JSON} A promise that resolves to an array of menu items.
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
 * @memberOf module:MenuAddModal
 * @param {Object} menuItem - The menu item object containing parameters to form the query string.
 * @returns {JSON} An array of ingredients that correspond to a menu item.
 */
export const getMenuItemIngredients = async (menuItem) => {
    try {
        const queryString = new URLSearchParams(menuItem).toString();
        const url = `https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/getIngreds?${queryString}`;

        const response = await axios.get(url);

        if (!response.status === 200) {
            throw new Error(response.statusText);
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
 * @memberOf module:MenuAddModal
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
 * @memberOf module:MenuAddModal
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
 * Adds a specified menu item to the server.
 * @function
 * @param {Object} menuItem - Object containing the details of the menu item to add.
 * @returns {string} A string of the status of the add operation.
 */
export const addMenuItem = async (menuItem) => {
    try {
        const response = await axios.post("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems", menuItem, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.status === 200) {
            throw new Error(response.statusText);
        }

        return { success: true, message: "Menu item added successfully" };
    } catch (error) {
        console.error("Error adding menu item:", error);
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
 * Component for displaying a modal dialog to add menu items.
 * Provides a form to input new menu item data.
 * @param {Object} props - Component props.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {Array} props.menuItems - Array of all menu items.
 * @param {Array} props.inventoryItems - Array of all inventory items.
 * @param {function} props.setMenuItems - Function to update the list of menu items.
 * @param {function} props.setMenuItemsGrid - Function to update the grid of menu items.
 * @param {function} props.setInventoryItems - Function to update the list of inventory items.
 */
export default function MenuAddModal({ onClose, isOpen, menuItems, setMenuItems,  inventoryItems, setInventoryItems, menuItemsGrid, setMenuItemsGrid }) {
    const [addItemName, setAddItemName] = useState(""); // Separate state variable for Add Menu Item form
    const [addPrice, setAddPrice] = useState(""); // Separate state variable for Add Menu Item form
    const [addItemCategory, setAddItemCategory] = useState(0); // Separate state variable for Add Menu Item form
    const [addErrorMessage, setAddErrorMessage] = useState("");
    const [addSuccessMessage, setAddSuccessMessage] = useState("");
    const [ingredients, setIngredients] = useState([]); // State variable for ingredients
    const [isSeasonal, setIsSeasonal] = useState(false); // State for seasonal checkbox
    const [expirationDate, setExpirationDate] = useState(""); // State for expiration date
    const [addDescription, setAddDescription] = useState(""); // Separate state variable for Add Menu Item form
    const [addCalories, setAddCalories] = useState(""); // Separate state variable for Add Menu Item form
    const [addDiet, setAddDiet] = useState(0); // Separate state variable for Add Menu Item form
    const [addAllergy, setAddAllergy] = useState(false); // Separate state variable for Add Menu Item form

    if (!isOpen) return null;

    /**
     * Fetches the list of menu items from the server.
     * @memberOf module:MenuAddModal
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
     * Fetches the list of menu items with ingredients from the server.
     * @memberOf module:MenuAddModal
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
     * Handles the add item process.
     * @memberOf module:MenuAddModal
     * @param {Event} e - The event object from the form submission.
     */
    const handleAddMenuItem = async (e) => {
        e.preventDefault();

        if (!validateItemName(addItemName) || !validatePrice(addPrice) || !validateCalories(addCalories)) {
            setAddErrorMessage("Please fill out all fields correctly.");
            return;
        }

        try {
            const response = await addMenuItem({
                itemName: addItemName,
                price: addPrice,
                category: isSeasonal ? 6 : addItemCategory,
                description: addDescription,
                "Calories": addCalories,
                specialdiet: addDiet,
                allergy: addAllergy ? 0 : 1,
                ingredients,
                isSeasonal: isSeasonal,
                expirationDate: expirationDate
            });
            setAddSuccessMessage(response.message);
            setAddErrorMessage("");
            setAddItemName("");
            setAddPrice("");
            setAddItemCategory(0); // Reset category to default value after successful submission
            setAddDescription("");
            setAddCalories("");
            setAddDiet(0);
            setAddAllergy(false);
            setIngredients([]); // Clear ingredients after adding the menu item
            setIsSeasonal(false);
            setExpirationDate("");
            fetchMenuItems();
            fetchMenuItemsWithIngredients();
        } catch (error) {
            setAddErrorMessage(error.message);
        }
    };

    /**
     * Handles selection changes in the ingredients dropdown.
     * @memberOf module:MenuAddModal
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
     * @memberOf module:MenuAddModal
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
     * @memberOf module:MenuAddModal
     */
    const addIngredient = () => {
        setIngredients([...ingredients, { inventID: null, name: "", quantity: 1 }]);
    };

    /**
     * Removes an ingredient from the list.
     * @memberOf module:MenuAddModal
     * @param {number} index - The index of the ingredient to remove.
     */
    const removeIngredient = (index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
    };

    /**
     * Validates the item name input.
     * @memberOf module:MenuAddModal
     * @param {string} itemName - The name of the menu item to validate.
     * @returns {boolean} True if the item name is valid, false otherwise.
     */
    const validateItemName = (itemName) => {
        return itemName.trim() !== "";
    };

    /**
     * Validates the price input.
     * @memberOf module:MenuAddModal
     * @param {string} price - The price to validate.
     * @returns {boolean} True if the price is a valid number greater than 0, false otherwise.
     */
    const validatePrice = (price) => {
        return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
    };

    /**
     * Validates the calories input.
     * @memberOf module:MenuAddModal
     * @param {string} calories - The calorie count to validate.
     * @returns {boolean} True if the calorie count is a valid non-negative integer, false otherwise.
     */
    const validateCalories = (calories) => {
        return !isNaN(parseInt(calories)) && parseInt(calories) >= 0;
    }

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

                    <h1 className="p-3 mt-5 text-xl font-semibold text-center ">ADDING MENU ITEMS</h1>
                    {addErrorMessage && (
                        <p className="text-red-500">{addErrorMessage}</p>
                    )}
                    {addSuccessMessage && (
                        <p className="text-green-500">{addSuccessMessage}</p>
                    )}
                    <form onSubmit={handleAddMenuItem} className="flex flex-col items-center justify-center">
                        <input
                            type="text"
                            placeholder="Item Name"
                            value={addItemName}
                            onChange={(e) => setAddItemName(e.target.value)}
                            className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={addPrice}
                            onChange={(e) => setAddPrice(e.target.value)}
                            className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                            required
                        />
                        <div className="flex justify-between items-center mb-2 bg-white shadow-input outline-none border focus:border-red-800 rounded-lg px-2 py-2.5 ">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isSeasonal}
                                    onChange={(e) => setIsSeasonal(e.target.checked)}
                                    className={`mb-1.5 px-4 justify-center items-center accent-red-800 form-checkbox h-4 w-5`}
                                />
                                <label className="ml-1 mb-2 justify-centere items-center">
                                    Seasonal Item
                                </label>
                            </div>
                        </div>

                        {/* Show expiration date input field if the item is seasonal */}
                        {isSeasonal && (
                            <div className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5">
                                <p>Expiration Date:</p>
                                <input
                                    type="date"
                                    value={expirationDate}
                                    onChange={(e) => setExpirationDate(e.target.value)}
                                    className="mb-2  border focus:border-red-800 rounded-lg px-2 py-1"
                                    required
                                />
                            </div>
                        )}
                        <select
                            value={isSeasonal ? 6 : addItemCategory}
                            onChange={(e) => setAddItemCategory(parseInt(e.target.value))}
                            className="mb-1 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                            disabled={isSeasonal}
                        >
                            {categories.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        <textarea
                            type="text"
                            placeholder="Description"
                            value={addDescription}
                            onChange={(e) => setAddDescription(e.target.value)}
                            className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5 resize:vertical"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Calories"
                            value={addCalories}
                            onChange={(e) => setAddCalories(e.target.value)}
                            className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                            required
                        />
                        <select
                            value={addDiet}
                            onChange={(e) => setAddDiet(parseInt(e.target.value))}
                            className="mb-1 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                        >
                            {dietCategories.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        <div className="flex justify-between items-center mb-2 bg-white shadow-input outline-none border focus:border-red-800 rounded-lg px-2 py-2.5 ">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={addAllergy}
                                    onChange={(e) => setAddAllergy(e.target.checked)}
                                    className={`mb-1.5 px-4 justify-center items-center accent-red-800 form-checkbox h-4 w-5`}
                                />
                                <label className="ml-1 mb-2 justify-centere items-center">
                                    Gluten Free
                                </label>
                            </div>
                        </div>
                        <h2 className="p-3 md:p text-xl font-semibold text-center">Ingredients</h2>
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="flex justify-between mb-2 ">
                                <select
                                    value={ingredients[index]?.name || ""}
                                    onChange={(e) => handleIngredientSelection(e, index)}
                                    className="w-full md:w-1/2 flex flex-col items-center mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-1"
                                    required
                                >
                                    <option value="">Select Inventory Item</option>
                                    {inventoryItems.map(item => (
                                        <option key={item.inventid} value={item.ingredientname}>{item.ingredientname}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleQuantityChange(e, index)}
                                    className="w-full md:w-1/4 flex flex-col items-center mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-1 py-1"
                                    required
                                />
                                <button type="button" className="mb-2 flex flex-col items-center bg-red-800 text-white rounded px-4 py-2" onClick={() => removeIngredient(index)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addIngredient} className=" mb-4 bg-gray-500 text-white rounded px-2 py-1" >Add Ingredient</button>
                        <button type="submit" className="bg-red-800 text-white rounded px-4 py-2">ADD</button>
                    </form>
                </div>
            </div>
        </div>
    );
}