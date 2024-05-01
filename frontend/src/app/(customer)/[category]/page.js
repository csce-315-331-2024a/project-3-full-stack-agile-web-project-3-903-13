"use client";

import { useEffect, useState } from 'react';
import { TransactionContext, TransactionProvider, useTransaction } from "@/components/transactions/TransactionContext";
import Image from 'next/image'
import { toast } from 'react-toastify';
import UpdateModal from "@/components/updateItems/customerView";
import moment from 'moment';
import axios from 'axios';

export const getMenuItemSeasonal = async (menuItem) => {
    try {
      const url = `https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems/seasonal?${new URLSearchParams(menuItem).toString()}`;
      const response = await axios.get(url);
  
      if (!response.data.success) { // Assuming the API returns success status
        throw new Error(response.data.message || 'Error fetching seasonal info');
      }
  
      return response.data.data; // Assuming the data is in response.data.data
    } catch (error) {
      console.error("Error fetching seasonal info for menu item:", error);
      throw error;
    }
  };


const categories = [
    "Burgers",
    "Dogs",
    "Tenders",
    "Sides",
    "Desserts",
    "Beverages",
    "Seasonal"
]

export default function Page({ params }) {
    const [itemType, setItemType] = useState([]);
    const { updateTransaction, transactions } = useTransaction();
    const [scaleStates, setScaleStates] = useState({});
    const [seasonalItems, setSeasonalItems] = useState(new Map());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);


    useEffect(() => {
        const fetchMenuItems = async () => {
          const response = await axios.get('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems');
          const data = response.data.data; // Assuming the data is in response.data.data
          const items = data.filter(item => item.category === parseInt(categories.indexOf(params.category)));
          setItemType(items);
    
          let initialScales = {};
          const seasonalInfoMap = new Map();
    
          for (const item of items) {
            const seasonalData = await getMenuItemSeasonal({ itemName: item.itemname });
            const isSeasonal = seasonalData.length === 0 || (seasonalData.length > 0 && new Date(seasonalData[0].expirationdate) >= new Date());
            seasonalInfoMap.set(item.menuid, isSeasonal);
            initialScales[item.menuid] = 'normal';
          }
    
          setScaleStates(initialScales);
          setSeasonalItems(seasonalInfoMap);
        };
    
        fetchMenuItems();
      }, [params.category]);


    const handleItemClick = (item) => {
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const closeUpdateModal = () => {
        setIsModalOpen(false);
    }

    const isCustomizable = (item) => {
        if (item == null){
            return true;
        }

        const nonCustomizable = ["16 oz aquafina water", "20 oz aquafina water", "20 oz fountain drink", "20 oz Aquafina", "French Fries"]
        if (nonCustomizable.indexOf(item.itemname) !== -1) {
            return false
        }
        return true
    }



    const getItemScale = (menuId) => {
        return scaleStates[menuId] === 'clicked' ? 'pulse' : 'hover-effect';
    };

    return (
        <main className="min-h-screen py-10">
            <style jsx>{`
                .hover-effect {
                    transition: transform 0.3s ease-in-out;
                    transform: scale(1);
                }
                .hover-effect:hover {
                    transform: scale(1.03);
                }
                @keyframes pulse-animation {
                    0% { transform: scale(1.03); }
                    50% { transform: scale(1.08); }
                    100% { transform: scale(1.03); }
                }
                .pulse {
                    animation: pulse-animation 0.3s ease-in-out;
                }
                .info-text {
                    padding: 8px;
                    background-color: rgba(255, 255, 255, 1);
                    border-radius: 8px;
                }
            `}</style>

            <div className="container px-10 mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">{params.category}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {itemType.map((item, index) => (
    seasonalItems.get(item.menuid) && (
        <div
            key={index}
            className={`relative bg-white rounded-lg shadow-lg transition duration-300 ease-in-out aspect-square flex flex-col items-center space-evenly border-4 border-gray ${getItemScale(item.menuid)}`}
            onClick={() => handleItemClick(item)}
            aria-label={'Select ${item.itemname}'}
        >
            <>
                <Image
                    src={`/menuItems/${item.itemname.replace(/\s+/g, '')}.jpeg`}
                    alt={item.itemname}
                    className="object-cover w-2/3 h-2/3 rounded-lg mt-12"
                    width={150}
                    height={150}
                />
                <div className="absolute bottom-0 w-full text-center p-2">
                    <div className="info-text">
                        <h5 className="text-xl font-bold text-gray-900">{item.itemname}</h5>
                        <h5 className="text-lg font-semibold text-gray-700">${item.price}</h5>
                    </div>
                </div>
            </>
        </div>
    )
))}
                </div>

                <UpdateModal
                    isCustomizable={isCustomizable(selectedItem)}
                    isOpen={isModalOpen}
                    onClose={closeUpdateModal}
                    categoryIndex={categories.indexOf(params.category)}
                    item = {selectedItem}
                    ariaLabel="Update Item Modal"
                />

            </div>
        </main>
    );
}