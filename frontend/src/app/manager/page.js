"use client"

import { useEffect, useState } from "react";

export const getMenuItems = async () => {
  const items = await fetch("http://localhost:5000/api/menuitems");
  const data = await items.json();

  return data;
};

export const getInventoryItems = async () => {
  const items = await fetch("http://localhost:5000/api/inventory");
  const data = await items.json();

  return data;
};

export const addMenuItem = async (menuItem) => {
  const response = await fetch("http://localhost:5000/api/menuitems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItem),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  } else {
    return { success: true, message: "Menu item added successfully" };
  }
};

export const updateMenuItem = async (menuItem) => {
  const response = await fetch("http://localhost:5000/api/menuitems", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItem),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  } else {
    return { success: true, message: "Menu item updated successfully" };
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

export default function ManagerPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [addItemName, setAddItemName] = useState(""); // Separate state variable for Add Menu Item form
  const [addPrice, setAddPrice] = useState(""); // Separate state variable for Add Menu Item form
  const [addItemCategory, setAddItemCategory] = useState(0); // Separate state variable for Add Menu Item form
  const [updateItemName, setUpdateItemName] = useState(""); // Separate state variable for Update Menu Item form
  const [updatePrice, setUpdatePrice] = useState(""); // Separate state variable for Update Menu Item form
  const [updateErrorMessage, setUpdateErrorMessage] = useState("");
  const [addErrorMessage, setAddErrorMessage] = useState("");
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");
  const [addSuccessMessage, setAddSuccessMessage] = useState("");
  const [ingredients, setIngredients] = useState([]); // State variable for ingredients
  const [initialInventoryItems, setInitialInventoryItems] = useState([]); // Add this line
  const [inventoryItems, setInventoryItems] = useState(
    initialInventoryItems.map(item => ({ ...item, disabled: false }))
  ); // Initialize inventoryItems with disabled property
  const [isSeasonal, setIsSeasonal] = useState(false); // State for seasonal checkbox
  const [expirationDate, setExpirationDate] = useState(""); // State for expiration date

  useEffect(() => {
    fetchMenuItems();
    fetchInventoryItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const data = await getMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const data = await getInventoryItems();
      setInventoryItems(data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();

    if (!validateItemName(addItemName) || !validatePrice(addPrice)) {
      setAddErrorMessage("Please fill out all fields correctly.");
      return;
    }

    try {
      const response = await addMenuItem({ itemName: addItemName, price: addPrice, category: addItemCategory, ingredients, isSeasonal: isSeasonal, expirationDate: expirationDate  });
      setAddSuccessMessage(response.message);
      setAddErrorMessage("");
      setAddItemName("");
      setAddPrice("");
      setAddItemCategory(0); // Reset category to default value after successful submission
      setIngredients([]); // Clear ingredients after adding the menu item
      setIsSeasonal(false);
      setExpirationDate("");
      fetchMenuItems();
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


  const handleUpdateMenuItemPrice = async (e) => {
    e.preventDefault();

    if (!validateItemName(updateItemName) || !validatePrice(updatePrice)) {
      setUpdateErrorMessage("Please fill out all fields correctly.");
      return;
    }

    try {
      const response = await updateMenuItem({ itemName: updateItemName, newPrice: updatePrice });
      setUpdateSuccessMessage(response.message);
      setUpdateErrorMessage("");
      setUpdateItemName("");
      setUpdatePrice("");
      fetchMenuItems();
    } catch (error) {
      setUpdateErrorMessage(error.message);
    }
  };

  const validateItemName = (itemName) => {
    return itemName.trim() !== "";
  };

  const validatePrice = (price) => {
    return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
  };

  return (
    <main className="min-h-screen flex flex-column items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="p-3 md:p">ADDING MENU ITEMS</h1>
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
            className="mb-2 shadow-input outline-none border focus:border-blue-500 rounded-lg px-4 py-2.5"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={addPrice}
            onChange={(e) => setAddPrice(e.target.value)}
            className="mb-2 shadow-input outline-none border focus:border-blue-500 rounded-lg px-4 py-2.5"
            required
          />
          <label className="mb-2 shadow-input outline-none border focus:border-blue-500 rounded-lg px-4 py-2.5">
            <input
              type="checkbox"
              checked={isSeasonal}
              onChange={(e) => setIsSeasonal(e.target.checked)}
              className="mb-2 px-4 justify-center align-center"
            />
            Seasonal Item
          </label>
          {/* Show expiration date input field if the item is seasonal */}
          {isSeasonal && (
            <>
              <p>Expiration Date:</p>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="mb-2"
                required
              />
            </>
          )}
          <select
            value={isSeasonal ? 6 : addItemCategory}
            onChange={(e) => setAddItemCategory(parseInt(e.target.value))}
            className="mb-2"
            required
            disabled={isSeasonal}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <h2>Ingredients</h2>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center mb-2">
              <select
                value={ingredients[index]?.name || ""}
                onChange={(e) => handleIngredientSelection(e, index)}
                className="mr-2"
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
                className="mr-2"
                required
              />
              <button type="button" onClick={() => removeIngredient(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={addIngredient}>Add Ingredient</button>
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Add Menu Item</button>
        </form>
        <h2>Update Menu Item Price</h2>
        {updateErrorMessage && (
          <p className="text-red-500">{updateErrorMessage}</p>
        )}
        {updateSuccessMessage && (
          <p className="text-green-500">{updateSuccessMessage}</p>
        )}
        <form onSubmit={handleUpdateMenuItemPrice} className="flex flex-col items-center justify-center">
          <input
            type="text"
            placeholder="Item Name"
            value={updateItemName}
            onChange={(e) => setUpdateItemName(e.target.value)}
            className="mb-2"
            required
          />
          <input
            type="number"
            placeholder="New Price"
            value={updatePrice}
            onChange={(e) => setUpdatePrice(e.target.value)}
            className="mb-2"
            required
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Update Price</button>
        </form>
        {menuItems.map((item) => (
          <a
            href="#"
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            key={item.menuid}
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {item.itemname}
            </h5>
            <p>Price: {item.price}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
``
