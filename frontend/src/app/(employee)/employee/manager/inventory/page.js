"use client"

import { useEffect, useState } from "react";
import InventAddModal from "@/components/InventAddModal";
import InventRemoveModal from "@/components/InventRemoveModal";
import InventUpdateModal from "@/components/InventUpdateModal";


export const getInventoryItems = async () => {
	const items = await fetch("http://localhost:5000/api/inventory");
	const data = await items.json();

	return data;
};








export default function InventoryPage() {
	const [inventoryItems, setInventoryItems] = useState([]);

	const [showAddPopup, setShowAddPopup] = useState(false);
	const [showUpdatePopup, setShowUpdatePopup] = useState(false);
	const [showRemovePopup, setShowRemovePopup] = useState(false);

	useEffect(() => {
		fetchInventoryItems();
	}, []);

	const handleShowAddPopup = () => setShowAddPopup(true);
	const handleHideAddPopup = () => setShowAddPopup(false);

	const handleShowUpdatePopup = () => setShowUpdatePopup(true);
	const handleHideUpdatePopup = () => setShowUpdatePopup(false);

	const handleShowRemovePopup = () => setShowRemovePopup(true);
	const handleHideRemovePopup = () => setShowRemovePopup(false);

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

	return (
		<main className="min-h-screen flex flex-col">
			<h1 className="text-4xl font-bold text-center mb-3 py-4">
				Inventory Hub
			</h1>
			<div className="w-full  max-w-screen-xl mx-auto">
				<div className="flex justify-evenly mb-8">
					<button onClick={handleShowAddPopup} className="bg-red-800 text-white rounded px-4 py-2 hover:bg-red-700">
						Add Inventory Item
					</button>
					<button onClick={handleShowUpdatePopup} className="bg-red-800 text-white rounded px-4 py-2 hover:bg-red-700">
						Update Inventory Item
					</button>
					<button onClick={handleShowRemovePopup} className="bg-red-800 text-white rounded px-4 py-2 hover:bg-red-700">
						Remove Inventory Item
					</button>



				</div>

				<div className="grid grid-cols-4 gap-4" aria-label="Invetory Items">
					{inventoryItems.map((item) => (
						<a
							href="#"
							className="block max-w-sm p-6 pl-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
							key={item.inventid}
						>
							<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
								{item.ingredientname}
							</h5>
							<p className="mb-4 p-2 bg-gray-200 rounded-lg border border-gray-900">Count: {item.count}</p>
							<p className="mb-4 p-2 bg-gray-200 rounded-lg border border-gray-900">Price: {item.price}</p>
							<p className="mb-4 p-2 bg-gray-200 rounded-lg border border-gray-900">Min Count: {item.mincount}</p>
						</a>
					))}
				</div>


			</div>
			<InventAddModal
				onClose={handleHideAddPopup}
				isOpen={showAddPopup}
				inventoryItems={inventoryItems}
				setInventoryItems={setInventoryItems}
			/>
			<InventUpdateModal
				onClose={handleHideUpdatePopup}
				isOpen={showUpdatePopup}
				inventoryItems={inventoryItems}
				setInventoryItems = {setInventoryItems}
			/>
			<InventRemoveModal
				onClose={handleHideRemovePopup}
				isOpen={showRemovePopup}
				inventoryItems={inventoryItems}
				setInventoryItems = {setInventoryItems}
			/>
		</main>
	);
}
``