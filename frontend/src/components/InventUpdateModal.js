import React, { useState, useEffect } from 'react';

export const getInventoryItems = async () => {
	const items = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory");
	const data = await items.json();

	return data;
};

export const updateInventCount = async (inventItem) => {
	const response = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory/updateQuantity", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(inventItem),
	});

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	} else {
		return { success: true, message: "Inventory item count updated successfully" };
	}
};

export const updateInventPrice = async (inventItem) => {
	const response = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory/updatePrice", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(inventItem),
	});

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	} else {
		return { success: true, message: "Inventory item price updated successfully" };
	}
};


export const updateInventMin = async (inventItem) => {
	const response = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory/updateMinCount", {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(inventItem),
	});

	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	} else {
		return { success: true, message: "Inventory item minimum count updated successfully" };
	}
};

const categories = [
	{ label: "Update Item Count", value: 0 },
	{ label: "Update Item Price ", value: 1 },
	{ label: "Update Item Min Count", value: 2 },
];

export default function InventUpdateModal({isOpen, onClose, inventoryItems, setInventoryItems}){
    const [updateItemName, setUpdateItemName] = useState("");
	const [updateCount, setUpdateCount] = useState("");
	const [updatePrice, setUpdatePrice] = useState("");
	const [updateMinCount, setUpdateMinCount] = useState("");
	const [updateCategory, setUpdateCategory] = useState("");
    const [updateErrorMessage, setUpdateErrorMessage] = useState("");
    const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");

    if (!isOpen) return null;

    const fetchInventoryItems = async () => {
		try {
			const data = await getInventoryItems();
			setInventoryItems(data);
		} catch (error) {
			console.error("Error fetching inventory items:", error);
		}
	};

    const handleUpdateInventoryItem = async (e) => {
		e.preventDefault();

		try {
			let response;
			if (updateCategory == 0) {
				if (!validateItemName(updateItemName) || !validateCount(updateCount)) {
					setUpdateErrorMessage("Please fill out all fields correctly.");
					return;
				}
				response = await updateInventCount({ itemName: updateItemName, newCount: updateCount });
			} else if (updateCategory == 1) {
				if (!validateItemName(updateItemName) || !validatePrice(updatePrice)) {
					setUpdateErrorMessage("Please fill out all fields correctly.");
					return;
				}
				response = await updateInventPrice({ itemName: updateItemName, newPrice: updatePrice });
			} else if (updateCategory == 2) {
				if (!validateItemName(updateItemName) || !validateMinCount(updateMinCount)) {
					setUpdateErrorMessage("Please fill out all fields correctly.");
					return;
				}
				response = await updateInventMin({ itemName: updateItemName, newCount: updateMinCount });
			}
			setUpdateSuccessMessage(response.message);
			setUpdateErrorMessage("");
			setUpdateItemName("");
			setUpdatePrice("");
			setUpdateCount("");
			setUpdateMinCount("");
			fetchInventoryItems();
		} catch (error) {
			setUpdateErrorMessage(error.message);
			setUpdateSuccessMessage("");
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
						<h1 className="p-3 md:p text-xl font-semibold text-center">UPDATE INVENTORY ITEM</h1>
						{updateErrorMessage && (
							<p className="text-red-500">{updateErrorMessage}</p>
						)}
						{updateSuccessMessage && (
							<p className="text-green-500">{updateSuccessMessage}</p>
						)}
						<form onSubmit={handleUpdateInventoryItem} className="flex flex-col items-center justify-center">
							<select
								value={updateCategory}
								onChange={(e) => setUpdateCategory(parseInt(e.target.value))}
								className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
								required
							>
								{categories.map((cat) => (
									<option key={cat.value} value={cat.value}>{cat.label}</option>
								))}
							</select>
							<select
								value={updateItemName}
								onChange={(e) => setUpdateItemName(e.target.value)}
								className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
								required
							>
								<option value="">Select Item Name</option>
								{inventoryItems.map(name => (
									<option key={name.ingredientname} value={name.ingredientname}>{name.ingredientname}</option>
								))}
							</select>
							{updateCategory == 0 && (
								<input
									type="number"
									placeholder="New Count"
									value={updateCount}
									onChange={(e) => setUpdateCount(e.target.value)}
									className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
									required
								/>
							)}
							{updateCategory == 1 && (
								<input
									type="number"
									placeholder="New Price"
									value={updatePrice}
									onChange={(e) => setUpdatePrice(e.target.value)}
									className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
									required
								/>
							)}
							{updateCategory == 2 && (
								<input
									type="number"
									placeholder="New Minimum Count"
									value={updateMinCount}
									onChange={(e) => setUpdateMinCount(e.target.value)}
									className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
									required
								/>
							)}

							<button type="submit" className="bg-red-800 text-white rounded px-4 py-2 w-full">UPDATE</button>
						</form>
					</div>
                    </div>
                    </div>
    );
}