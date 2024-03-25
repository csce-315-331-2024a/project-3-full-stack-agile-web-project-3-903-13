"use client"
import { parse } from "postcss";
import { useEffect, useState } from "react";

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

const categories = [
  { label: "Burgers/Sandwiches", value: 0 },
  { label: "Corn Dogs/Hot Dogs", value: 1 },
  { label: "Chicken Tenders", value: 2 },
  { label: "French Fries", value: 3 },
  { label: "Shakes/Ice Cream", value: 4 },
  { label: "Beverages", value: 5 },
  { label: "Seasonal", value: 6 },
];

export default function ManagerPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(0); // Default category value
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchMenuItems();
  }, []);

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

    if (!validateItemName(itemName) || !validatePrice(price)) {
      setErrorMessage("Please fill out all fields correctly.");
      return;
    }

    try {
      await addMenuItem({ itemName, price, category });
      setErrorMessage("");
      setItemName("");
      setPrice("");
      setCategory(0); // Reset category to default value after successful submission
      fetchMenuItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const validateItemName = (itemName) => {
    return itemName.trim() !== "";
  };

  const validatePrice = (price) => {
    return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
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
          <select
            value={category}
            onChange={(e) => setCategory(parseInt(e.target.value))}
            className="mb-2"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
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
