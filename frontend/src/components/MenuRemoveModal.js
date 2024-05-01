import React, {useState, useEffect} from 'react';
import { FaTrash } from "react-icons/fa";
import axios from 'axios';


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

export const removeMenuItem = async (menuItem) => {
  try {
    const response = await axios.delete("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems", {
      data: menuItem,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return { success: true, message: "Menu item removed successfully" };
  } catch (error) {
    console.error("Error removing menu item:", error);
    throw error;
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