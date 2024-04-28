import React, { useState, useEffect } from 'react';

export const getInventoryItems = async () => {
	const items = await fetch("http://localhost:5000/api/inventory");
	const data = await items.json();

	return data;
};

export const addInventoryItem = async (inventItem) => {
	const response = await fetch("http://localhost:5000/api/inventory", {
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
export default function InventAddModal({isOpen, onClose, inventoryItems, setInventoryItems}){
    const [addItemName, setAddItemName] = useState("");
	const [addCount, setAddCount] = useState("");
	const [addPrice, setAddPrice] = useState("");
	const [addMinCount, setAddMinCount] = useState("");
    const [addErrorMessage, setAddErrorMessage] = useState("");
    const [addSuccessMessage, setAddSuccessMessage] = useState("");

    if (!isOpen) return null;

    const fetchInventoryItems = async () => {
		try {
			const data = await getInventoryItems();
			setInventoryItems(data);
		} catch (error) {
			console.error("Error fetching inventory items:", error);
		}
	};

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