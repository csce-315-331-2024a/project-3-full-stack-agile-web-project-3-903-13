/**
 * @module InventAddModal
 */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Fetches the inventory items.
 * @function
 * @memberOf module:InventAddModal
 * @returns {JSON} An array of the inventory items.
 */
export const getInventoryItems = async () => {
	try {
	  const response = await axios.get('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory');
	  return response.data;
	} catch (error) {
	  console.error('Error fetching inventory items:', error);
	  throw error; // Re-throw the error for handling in the calling component
	}
  };

/**
 * Adds the specified inventory item on the server.
 * @function
 * @memberOf module:InventAddModal
 * @param {Object} inventItem - The inventory item object to be added and item identifier.
 * @returns {string} A string for a success message if the adding is successful.
 */
export const addInventoryItem = async (inventItem) => {
	const response = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(inventItem),
	});

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	} else {
		return { success: true, message: "Inventory item added successfully" };
	}
};

/**
 * Component that provides a modal for adding new inventory items.
 * It allows the user to input details for a new inventory item such as name, count, price, and minimum count.
 * @function
 * @memberOf module:InventAddModal
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - Controls if the modal is open or not.
 * @param {function} props.onClose - Function to call to close the modal.
 * @param {Array} props.inventoryItems - List of current inventory items.
 * @param {function} props.setInventoryItems - Function to update the inventory items state after adding a new item.
 * @returns {React.Component} A React component that provides a user interface for adding inventory items.
 */
export default function InventAddModal({isOpen, onClose, inventoryItems, setInventoryItems}){
    const [addItemName, setAddItemName] = useState("");
	const [addCount, setAddCount] = useState("");
	const [addPrice, setAddPrice] = useState("");
	const [addMinCount, setAddMinCount] = useState("");
    const [addErrorMessage, setAddErrorMessage] = useState("");
    const [addSuccessMessage, setAddSuccessMessage] = useState("");

    if (!isOpen) return null;

	/**
	 * Fetches the current list of inventory items from the server and updates the component state.
	 * @memberOf module:InventAddModal
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
	 * Handles the submission of the new inventory item form.
	 * Validates the form data and sends it to the server to add a new inventory item.
	 * @memberOf module:InventAddModal
	 * @param {Event} e - The event object from the form submission.
	 */
    const handleAddInventoryItem = async (e) => {
		e.preventDefault();

		if (!validateItemName(addItemName) || !validatePrice(addPrice) || !validateCount(addCount) || !validateMinCount(addMinCount)) {
			setAddErrorMessage("Please fill out all fields correctly.");
			return;
		}

		try {
			const response = await addInventoryItem({ itemName: addItemName, count: addCount, price: addPrice, mincount: addMinCount });
			setAddSuccessMessage(response.message);
			setAddErrorMessage("");
			setAddItemName("");
			setAddCount("");
			setAddMinCount("");
			setAddPrice("");
			fetchInventoryItems();
		} catch (error) {
			setAddErrorMessage(error.message);
			setAddSuccessMessage("");
		}
	};

	/**
	 * Validates that the provided item name is not empty.
	 * @memberOf module:InventAddModal
	 * @param {string} itemName - The name to validate.
	 * @returns {boolean} True if the item name is valid, false otherwise.
	 */
    const validateItemName = (itemName) => {
		return itemName.trim() !== "";
	};

	/**
	 * Validates that the provided item price is not empty.
	 * @memberOf module:InventAddModal
	 * @param {string} itemName - The price to validate.
	 * @returns {boolean} True if the item price is valid, false otherwise.
	 */
	const validatePrice = (price) => {
		return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
	};

	/**
	 * Validates that the provided count is a positive integer.
	 * @memberOf module:InventAddModal
	 * @param {string} count - The count to validate.
	 * @returns {boolean} True if the count is valid, false otherwise.
	 */
	const validateCount = (count) => {
		return !isNaN(parseInt(count)) && isFinite(count) && parseFloat(count) > 0;
	};

	/**
	 * Validates that the provided minimum count is a positive integer.
	 * @memberOf module:InventAddModal
	 * @param {string} count - The minimum count to validate.
	 * @returns {boolean} True if the minimum count is valid, false otherwise.
	 */
	const validateMinCount = (count) => {
		return !isNaN(parseInt(count)) && isFinite(count) && parseFloat(count) > 0;
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
						<h1 className="p-3 md:p text-xl font-semibold text-center">ADDING INVENTORY ITEMS</h1>
						{addErrorMessage && (
							<p className="text-red-500">{addErrorMessage}</p>
						)}
						{addSuccessMessage && (
							<p className="text-green-500">{addSuccessMessage}</p>
						)}
						<form onSubmit={handleAddInventoryItem} className="flex flex-col items-center justify-center">
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
								placeholder="Count"
								value={addCount}
								onChange={(e) => setAddCount(e.target.value)}
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
							<input
								type="number"
								placeholder="Minimum Count"
								value={addMinCount}
								onChange={(e) => setAddMinCount(e.target.value)}
								className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
								required
							/>
							<button type="submit" className="bg-red-800 text-white rounded px-4 py-2 w-full">ADD</button>
						</form>
					</div>
                    </div>
                    </div>
    )
}