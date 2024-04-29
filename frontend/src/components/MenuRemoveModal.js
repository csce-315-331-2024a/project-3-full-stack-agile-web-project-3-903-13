import React, {useState, useEffect} from 'react';
import { FaTrash } from "react-icons/fa";


export const getMenuItems = async () => {
    const items = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems");
    const data = await items.json();
  
    return data;
  };
  
  export const getMenuItemIngredients = async (menuItem) => {
    try {
      // Construct the query string from the menuItem object
      const queryString = new URLSearchParams(menuItem).toString();
  
      // Append the query string to the URL
      const url = `https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/getIngreds?${queryString}`;
  
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
      const items = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems");
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
    const items = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory");
    const data = await items.json();
  
    return data;
  };

  


export const removeMenuItem = async (menuItem) => {
    const response = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuItem),
    });
  
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    } else {
      return { success: true, message: "Menu item removed successfully" };
    }
  };
export default function MenuRemoveModal ({onClose, isOpen, menuItems, inventoryItems, setMenuItemsGrid, setMenuItems}){
    const [removeItemName, setRemoveMenuItem] = useState("");
  const [removeErrorMessage, setRemoveErrorMessage] = useState("");
  const [removeSuccessMessage, setRemoveSuccessMessage] = useState("");

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

  const handleRemoveMenuItem = async (e) => {
    e.preventDefault();
    try {
      const response = await removeMenuItem({ itemName: removeItemName });
      setRemoveSuccessMessage(response.message);
      setRemoveErrorMessage("");
      setRemoveMenuItem("");
      fetchMenuItems();
      fetchMenuItemsWithIngredients();
    } catch (error) {
      setRemoveErrorMessage(error.message);
      setRemoveSuccessMessage("");
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
    <h1 className="p-3 md:p p-3 text-xl font-semibold text-center">REMOVING MENU ITEMS</h1>
    {removeErrorMessage && (
      <p className="text-red-500">{removeErrorMessage}</p>
    )}
    {removeSuccessMessage && (
      <p className="text-green-500">{removeSuccessMessage}</p>
    )}
    <form onSubmit={handleRemoveMenuItem} className="flex flex-col items-center justify-center">
      <select
        value={removeItemName}
        onChange={(e) => setRemoveMenuItem(e.target.value)}
        className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
      >
        <option value="">Select Menu Item</option>
        {menuItems.map(item => (
          <option key={item.menuid} value={item.itemname}>{item.itemname}</option>
        ))}
      </select>
      <button type="submit" className="bg-red-800 text-white rounded px-4 py-2">REMOVE</button>
    </form>
  </div>
  </div>
  </div>
  );
}