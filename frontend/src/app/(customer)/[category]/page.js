"use client";

import { useEffect, useState } from 'react';
import { TransactionContext, TransactionProvider, useTransaction } from "@/components/TransactionContext";

const categories = [
    "burgers",
    "hotdogs",
    "tenders",
    "fries",
    "shakes",
    "beverages",
    "seasonal"
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
            <style>
                {`
                    .hover-effect {
                        transition: transform 0.3s ease-in-out;
                        transform: scale(1);
                    }
                    .hover-effect:hover {
                        transform: scale(1.03);  // Slight increase when hovered
                    }
                    @keyframes pulse-animation {
                        0% { transform: scale(1.03); }
                        50% { transform: scale(1.08); }
                        100% { transform: scale(1.03); }
                    }
                    .pulse {
                        animation: pulse-animation 0.3s ease-in-out;
                    }
                `}
            </style>
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">{params.category}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itemType.map((item) => (
                        <div key={item.menuID} className={`relative bg-white rounded-lg shadow-lg transition duration-300 ease-in-out aspect-square ${getItemScale(item.menuid)}`} onClick={() => sendToTransaction(item)}>
                            <img
                                src={"/* IDK HOW TO GET THIS TO WORK */"}
                                alt={item.itemname}
                                className="object-cover w-full h-full rounded-lg"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end p-4">
                                <h5 className="text-xl font-bold text-gray-900 text-center">{item.itemname}</h5>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
