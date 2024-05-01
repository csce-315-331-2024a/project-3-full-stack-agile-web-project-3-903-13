import React, { useState, useEffect } from 'react';
import { FaTrash } from "react-icons/fa";


export const getMenuItems = async () => {
    try {
        const response = await axios.get("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems");
        return response.data;
    } catch (error) {
        console.error("Error fetching menu items:", error);
        throw error;
    }
};

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

export const getInventoryItems = async () => {
    try {
        const response = await axios.get("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory");
        return response.data;
    } catch (error) {
        console.error("Error fetching inventory items:", error);
        throw error;
    }
};

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

    const fetchMenuItems = async () => {
        try {
            const data = await getMenuItems();
            setMenuItems(data);
        } catch (error) {
            console.error("Error fetching menu items:", error);
        }
    };

    const fetchMenuItemsWithIngredients = async () => {
        try {
            const data = await getMenuItemsWithIngredients();
            setMenuItemsGrid(data);
            console.log(data);
        } catch (error) {
            console.error("Error fetching menu items with ingredients:", error);
        }
    };

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
                Calories: addCalories,
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

    const handleQuantityChange = (e, index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index].quantity = parseInt(e.target.value);
        setIngredients(updatedIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { inventID: null, name: "", quantity: 1 }]);
    };

    const removeIngredient = (index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
    };
    const validateItemName = (itemName) => {
        return itemName.trim() !== "";
    };

    const validatePrice = (price) => {
        return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
    };

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