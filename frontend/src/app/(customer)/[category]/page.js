"use client";

import { useEffect, useState } from 'react';
import { TransactionContext, TransactionProvider, useTransaction } from "@/components/transactions/TransactionContext";
import Image from 'next/image'

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

    useEffect(() => {
        const fetchMenuItems = async () => {
            const response = await fetch('http://localhost:5000/api/menuitems');
            const data = await response.json();
            const items = data.filter(item => item.category === parseInt(categories.indexOf(params.category)));
            setItemType(items);
            let initialScales = {};
            items.forEach(item => initialScales[item.menuid] = 'normal');
            setScaleStates(initialScales);
        };

        fetchMenuItems();
    }, []);

    const sendToTransaction = (dish) => {
        var quantity = 0;
        if (transactions) {
            transactions.forEach(item => {
                if (dish.menuid === item.id) {
                    quantity = item.quantity + 1;
                }
            });
        }
        if (quantity === 0) {
            quantity = 1;
        }
        updateTransaction({ "id": dish.menuid, "itemname": dish.itemname, "price": dish.price, "quantity": quantity });
        setScaleStates(prev => ({ ...prev, [dish.menuid]: 'clicked' }));
        setTimeout(() => {
            setScaleStates(prev => ({ ...prev, [dish.menuid]: 'normal' }));
        }, 300);
    };

    const getItemScale = (menuId) => {
        return scaleStates[menuId] === 'clicked' ? 'pulse' : 'hover-effect';
    };

    return (
        <main className="min-h-screen bg-cream py-10">
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
                    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
                }
            `}</style>
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">{params.category}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {itemType.map((item) => (
                        <div key={item.menuID} className={`relative bg-white rounded-lg shadow-lg transition duration-300 ease-in-out aspect-square flex flex-col items-center space-evenly border-4 border-gray ${getItemScale(item.menuid)}`} onClick={() => sendToTransaction(item)}>
                            <img
                                src={`./menuItems/${item.itemname.replace(/\s+/g, '')}.jpeg`}
                                alt={item.itemname}
                                className="object-cover w-2/3 h-2/3 rounded-lg mt-12"
                            />
                            <div className="absolute bottom-0 w-full text-center p-2">
                                <div className="info-text">
                                    <h5 className="text-xl font-bold text-gray-900">{item.itemname}</h5>
                                    <h5 className="text-lg font-semibold text-gray-700">${item.price}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}