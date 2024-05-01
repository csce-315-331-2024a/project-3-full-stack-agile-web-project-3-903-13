/**
 * @module MenuRemoveModal
 */
import React, { useState, useEffect } from 'react';
import { FaTrash } from "react-icons/fa";
import axios from 'axios';

/**
 * Fetches all menu items from the API.
 * @function
 * @memberOf module:MenuRemoveModal
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
 * @memberOf module:MenuRemoveModal
 * @param {Object} menuItem - The menu item object containing parameters to form the query string.
 * @returns {JSON} An array of ingredients that correspond to a menu item.
 */
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

/**
 * Fetches the menu item and the corresponding ingredients.
 * @function
 * @memberOf module:MenuRemoveModal
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
 * @memberOf module:MenuRemoveModal
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
 * Removes a specified menu item from the server.
 * @function
 * @param {Object} menuItem - Object containing the details of the menu item to remove.
 * @returns {string} A string of the status of the remove operation.
 */
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

/**
 * Component for displaying a modal to remove menu items.
 * Provides a form to select a menu item for deletion.
 * @param {Object} props - Component props.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {Array} props.menuItems - Array of all menu items.
 * @param {function} props.setMenuItemsGrid - Function to update the grid of menu items.
 * @param {function} props.setMenuItems - Function to update the list of menu items.
 */
export default function MenuRemoveModal ({onClose, isOpen, menuItems, inventoryItems, setMenuItemsGrid, setMenuItems}){
    const [removeItemName, setRemoveMenuItem] = useState("");
  const [removeErrorMessage, setRemoveErrorMessage] = useState("");
  const [removeSuccessMessage, setRemoveSuccessMessage] = useState("");

  if (!isOpen) return null;

  /**
   * Fetches the list of menu items from the server.
   * @memberOf module:MenuRemoveModal
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
   * @memberOf module:MenuRemoveModal
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
   * Handles the menu item removal process.
   * @memberOf module:MenuRemoveModal
   * @param {Event} e - The event object from the form submission.
   */
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