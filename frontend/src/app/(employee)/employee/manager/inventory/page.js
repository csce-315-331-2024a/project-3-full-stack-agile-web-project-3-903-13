"use client"

import { useEffect, useState } from "react";

import InventAddModal from "@/components/InventAddModal";
import InventRemoveModal from "@/components/InventRemoveModal";
import InventUpdateModal from "@/components/InventUpdateModal";
import axios from "axios";

/**
 * Fetches inventory items from the server.
 * @memberOf module:InventoryPage
 * @returns {JSON} An array of inventory items.
 */
export const getInventoryItems = async () => {
	try {
	  const response = await axios.get('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory');
	  return response.data;
	} catch (error) {
	  console.error('Error fetching inventory items:', error);
	  // Handle error appropriately, e.g., throw an error or return a default value
	}
  };

/**
 * A React component page for managing inventory including adding, updating, and removing items.
 * This component uses modals for different actions and maintains local state for inventory items and modal visibility.
 * @module InventoryPage
 * @returns {JSX.Element} The rendered component for the Inventory management page.
 */
export default function InventoryPage() {
	const [inventoryItems, setInventoryItems] = useState([]);

	const [showAddPopup, setShowAddPopup] = useState(false);
	const [showUpdatePopup, setShowUpdatePopup] = useState(false);
	const [showRemovePopup, setShowRemovePopup] = useState(false);

	useEffect(() => {
		fetchInventoryItems();
	}, []);

	/**
	 * Handles opening the modal for adding inventory items.
	 * @memberOf module:InventoryPage
	 */
	const handleShowAddPopup = () => setShowAddPopup(true);
	/**
	 * Handles closing the modal for adding inventory items.
	 * @memberOf module:InventoryPage
	 */
	const handleHideAddPopup = () => setShowAddPopup(false);
	/**
	 * Handles opening the modal for updating inventory items.
	 * @memberOf module:InventoryPage
	 */
	const handleShowUpdatePopup = () => setShowUpdatePopup(true);
	/**
	 * Handles closing the modal for updating inventory items.
	 * @memberOf module:InventoryPage
	 */
	const handleHideUpdatePopup = () => setShowUpdatePopup(false);
	/**
	 * Handles opening the modal for removing inventory items.
	 * @memberOf module:InventoryPage
	 */
	const handleShowRemovePopup = () => setShowRemovePopup(true);
	/**
	 * Handles closing the modal for removing inventory items.
	 * @memberOf module:InventoryPage
	 */
	const handleHideRemovePopup = () => setShowRemovePopup(false);

	/**
	 * Fetches and sets inventory items to state by calling getInventoryItems. Handles any errors that might occur during fetching.
	 * @memberOf module:InventoryPage
	 */
	const fetchInventoryItems = async () => {
		try {
			const data = await getInventoryItems();
			setInventoryItems(data);
		} catch (error) {
			console.error("Error fetching inventory items:", error);
		}
	};


	return (
		<main className="min-h-screen flex flex-col" aria-label="Inventory Page">
			<h1 className="text-4xl font-bold text-center mb-3 py-4">
				Inventory Hub
			</h1>
			<div className="w-full  max-w-screen-xl mx-auto">
				<div className="flex justify-evenly mb-8">
					<button onClick={handleShowAddPopup} className="bg-red-800 text-white rounded px-4 py-2 hover:bg-red-700"
					aria-label="Add Inventory Item"
					>
						Add Inventory Item
					</button>
					<button onClick={handleShowUpdatePopup} className="bg-red-800 text-white rounded px-4 py-2 hover:bg-red-700"
					aria-label="Update Inventory Item"
					>
						Update Inventory Item
					</button>
					<button onClick={handleShowRemovePopup} className="bg-red-800 text-white rounded px-4 py-2 hover:bg-red-700"
					aria-label="Remove Inventory Item"
					>
						Remove Inventory Item
						
					</button>



				</div>

				<div className="grid grid-cols-4 gap-4" aria-label="Inventory Items">
					{inventoryItems.map((item) => (
						<a
							href="#"
							className="block max-w-sm p-6 pl-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
							key={item.inventid}
							aria-label={`Inventory Item: ${item.ingredientname}`}
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