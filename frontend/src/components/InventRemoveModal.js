import React, { useState, useEffect } from 'react';

export const getInventoryItems = async () => {
	const items = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory");
	const data = await items.json();

	return data;
};

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
export default function InventRemoveModal({isOpen, onClose, inventoryItems, setInventoryItems}){
    const [removeItemName, setRemoveItemName] = useState("");
    const [removeErrorMessage, setRemoveErrorMessage] = useState("");
	const [removeSuccessMessage, setRemoveSuccessMessage] = useState("");

    if (!isOpen) return null;

    const fetchInventoryItems = async () => {
		try {
			const data = await getInventoryItems();
			setInventoryItems(data);
		} catch (error) {
			console.error("Error fetching inventory items:", error);
		}
	};
    const validateItemName = (itemName) => {
		return itemName.trim() !== "";
	};

	const validatePrice = (price) => {
		return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
	};

	const validateCount = (count) => {
		return !isNaN(parseInt(count)) && isFinite(count) && parseFloat(count) > 0;
	};

	const validateMinCount = (count) => {
		return !isNaN(parseInt(count)) && isFinite(count) && parseFloat(count) > 0;
	};
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