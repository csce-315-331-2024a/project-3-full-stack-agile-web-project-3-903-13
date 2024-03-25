"use client"

import { useEffect, useState } from "react"; // Import useEffect as well if needed

export const getMenuItems = async () => {
  const items = await fetch("http://localhost:5000/api/menuitems");
  const data = await items.json();

  return data;
};

export const addMenuItem = async (menuItem) => {
  const response = await fetch("http://localhost:5000/api/menuitems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItem),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
};

export default function ManagerPage() { // Renamed the component to ManagerPage
  const [menuItems, setMenuItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []); // Empty dependency array to run once on mount

  const fetchMenuItems = async () => {
    try {
      const data = await getMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    try {
      await addMenuItem({ itemName, price, category });
      setErrorMessage("");
      setItemName("");
      setPrice("");
      setCategory("");
      fetchMenuItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <main className="min-h-screen flex flex-column items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1>MENU ITEMS</h1>
        {errorMessage && (
          <p className="text-red-500">{errorMessage}</p>
        )}
        <form onSubmit={handleAddMenuItem} className="flex flex-col items-center justify-center">
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="mb-2"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mb-2"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-2"
            required
          />
          <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">Add Menu Item</button>
        </form>
        {menuItems.map((item) => (
          <a
            href="#"
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            key={item.menuid}
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {item.itemname}
            </h5>
          </a>
        ))}
      </div>
    </main>
  );
}
