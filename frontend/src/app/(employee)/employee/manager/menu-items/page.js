"use client"


import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import MenuAddModal  from "@/components/MenuAddModal";
import MenuUpdateModal from "@/components/MenuUpdateModal";
import MenuRemoveModal from "@/components/MenuRemoveModal";

export const getMenuItems = async () => {
  const items = await fetch("http://localhost:5000/api/menuitems");
  const data = await items.json();

  return data;
};

export const getMenuItemIngredients = async (menuItem) => {
  try {
    // Construct the query string from the menuItem object
    const queryString = new URLSearchParams(menuItem).toString();

    // Append the query string to the URL
    const url = `http://localhost:5000/api/menuitems/getIngreds?${queryString}`;

    // Make the GET request
    const response = await fetch(url);

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ingredient for menu item:", error);
    throw error;
  }
};

export const getMenuItemsWithIngredients = async () => {
  try {
    // Fetch menu items
    const items = await fetch("http://localhost:5000/api/menuitems");
    const data = await items.json();

    // Fetch ingredients for each menu item
    const menuItemsWithIngredients = await Promise.all(
      data.map(async (menuItems) => {
        console.log(menuItems.itemname);

        const ingredients = await getMenuItemIngredients({ itemName: menuItems.itemname });
        return { ...menuItems, ingredients };
      })
    );

    return menuItemsWithIngredients;
  } catch (error) {
    console.error("Error fetching menu items with ingredients:", error);
    throw error;
  }
};
export const getInventoryItems = async () => {
  const items = await fetch("http://localhost:5000/api/inventory");
  const data = await items.json();

  return data;
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

  const fetchInventoryItems = async () => {
    try {
      const data = await getInventoryItems();
      setInventoryItems(data);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : "Unknown";
  };

  const getDietCategoryLabel = (categoryValue) => {
    const category = dietCategories.find(cat => cat.value === categoryValue);
    return category ? category.label : "Unknown";
  };

  const handleShowAddPopup = () => setShowAddPopup(true);
  const handleHideAddPopup = () => setShowAddPopup(false);

  const handleShowUpdatePopup = () => setShowUpdatePopup(true);
  const handleHideUpdatePopup = () => setShowUpdatePopup(false);

  const handleShowRemovePopup = () => setShowRemovePopup(true);
  const handleHideRemovePopup = () => setShowRemovePopup(false);


  const getAllergyLabel = (categoryValue) => {
    if (categoryValue == 0) {
      return "Yes";
    } else {
      return "No";
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
                <h6 className="mt-4 mb-2 text-lg font-semibold">Ingredients:</h6>
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
