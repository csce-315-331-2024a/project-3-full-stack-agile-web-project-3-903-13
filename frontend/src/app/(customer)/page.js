"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";

const categories = [
  "Burgers", "Hotdogs/Corndogs", "Chicken Tenders", "Sides", "Shakes", "Beverages", "Seasonal"
];

export const getMenuItems = async () => {
  const response = await fetch("http://localhost:5000/api/menuitems");
  const data = await response.json();
  return data;
}

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    const fetchMenuItems = async () => {
      const items = await getMenuItems();
      setMenuItems(items);
    };
    fetchMenuItems();
  }, []);

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-cream">
      <div className="container mx-auto py-10">
        <div className="flex justify-center mb-8">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(index)}
              className={`px-4 py-2 rounded-lg ${activeCategory === index ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <a key={item.menuid} href="#" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
              <Image
                src={`/images/${item.itemname}.jpg`} // Assuming the image name matches the item name
                alt={item.itemname}
                width={300}
                height={200}
                className="rounded"
              />
              <h5 className="mt-4 text-xl font-semibold text-gray-900">{item.itemname}</h5>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
