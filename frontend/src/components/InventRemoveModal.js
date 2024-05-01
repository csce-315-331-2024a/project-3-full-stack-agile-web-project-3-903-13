/**
 * @module InventRemoveModal
 */
import React, { useState, useEffect } from 'react';

/**
 * Fetches the inventory items.
 * @function
 * @memberOf module:InventRemoveModal
 * @returns {JSON} An array of the inventory items.
 */
export const getInventoryItems = async () => {
	const items = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory");
	const data = await items.json();

	return data;
};

/**
 * Removes the specified inventory item on the server.
 * @function
 * @memberOf module:InventRemoveModal
 * @param {Object} inventItem - The inventory item object to be removed and item identifier.
 * @returns {string} A string for a success message if the removal is successful.
 */
export const removeInventoryItem = async (inventItem) => {
	const response = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(inventItem),
	});

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	} else {
		return { success: true, message: "Inventory item removed successfully" };
	}
};

/**
 * Component that provides a modal for removing inventory items.
 * It facilitates the deletion of items from the inventory system.
 * @function
 * @memberOf module:InventRemoveModal
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isOpen - Controls if the modal is open or not.
 * @param {function} props.onClose - Function to call to close the modal.
 * @param {Array} props.inventoryItems - List of inventory items.
 * @param {function} props.setInventoryItems - Function to update the inventory items state.
 * @returns {React.Component} A React component that provides a user interface for removing inventory items.
 */
export default function InventRemoveModal({isOpen, onClose, inventoryItems, setInventoryItems}){
    const [removeItemName, setRemoveItemName] = useState("");
    const [removeErrorMessage, setRemoveErrorMessage] = useState("");
	const [removeSuccessMessage, setRemoveSuccessMessage] = useState("");

    if (!isOpen) return null;

	/**
	 * Fetches inventory items from the server and updates the local state.
	 * This function helps to refresh the list after an item has been removed.
	 * @memberOf module:InventRemoveModal
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
	 * Validates that the provided item name is not empty.
	 * This validation ensures that an item name has been selected before attempting removal.
	 * @memberOf module:InventRemoveModal
	 * @param {string} itemName - The name to validate.
	 * @returns {boolean} True if the item name is valid, false otherwise.
	 */
    const validateItemName = (itemName) => {
		return itemName.trim() !== "";
	};

	/**
	 * Validates that the provided item price is not empty.
	 * This validation ensures that an item price has been selected before attempting removal.
	 * @memberOf module:InventRemoveModal
	 * @param {string} price - The price to validate.
	 * @returns {boolean} True if the item price is valid, false otherwise.
	 */
	const validatePrice = (price) => {
		return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
	};

	/**
	 * Validates that the provided item count is not empty.
	 * This validation ensures that an item count has been selected before attempting removal.
	 * @memberOf module:InventRemoveModal
	 * @param {string} count - The count to validate.
	 * @returns {boolean} True if the item count is valid, false otherwise.
	 */
	const validateCount = (count) => {
		return !isNaN(parseInt(count)) && isFinite(count) && parseFloat(count) > 0;
	};

	/**
	 * Validates that the provided minimum item count is not empty.
	 * This validation ensures that the minimum item count has been selected before attempting removal.
	 * @memberOf module:InventRemoveModal
	 * @param {string} count - The minimum item count to validate.
	 * @returns {boolean} True if the minimum item count is valid, false otherwise.
	 */
	const validateMinCount = (count) => {
		return !isNaN(parseInt(count)) && isFinite(count) && parseFloat(count) > 0;
	};

	/**
	 * Handles the submission of the inventory item removal form.
	 * This function sends a request to delete a specified inventory item and handles the response.
	 * @memberOf module:InventRemoveModal
	 * @param {Event} e - The event object from the form submission.
	 */
    const handleRemoveInventoryItem = async (e) => {
		e.preventDefault();

		if (!validateItemName(removeItemName)) {
			setAddErrorMessage("Please fill out all fields correctly.");
			return;
		}

		try {
			const response = await removeInventoryItem({ itemName: removeItemName });
			setRemoveSuccessMessage(response.message);
			setRemoveErrorMessage("");
			setRemoveItemName("");
			fetchInventoryItems();
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
						<h1 className="p-3 md:p text-xl font-semibold text-center">REMOVE INVENTORY ITEM</h1>
						{removeErrorMessage && (
							<p className="text-red-500">{removeErrorMessage}</p>
						)}
						{removeSuccessMessage && (
							<p className="text-green-500">{removeSuccessMessage}</p>
						)}
						<form onSubmit={handleRemoveInventoryItem} className="flex flex-col items-center justify-center">
							<select
								value={removeItemName}
								onChange={(e) => setRemoveItemName(e.target.value)}
								className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
								required
							>
								<option value="">Select Item Name</option>
								{inventoryItems.map(name => (
									<option key={name.ingredientname} value={name.ingredientname}>{name.ingredientname}</option>
								))}
							</select>

							<button type="submit" className="bg-red-800 text-white rounded px-4 py-2 w-full">REMOVE</button>
						</form>
					</div>
                    </div>
                    </div>
    );
}