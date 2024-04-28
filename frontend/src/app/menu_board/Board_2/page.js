"use client";

import "../../globals.css";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const MenuBoard = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     fetch('http://localhost:5000/api/menuitems')
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             setMenuItems(data);
    //             setIsLoading(false);
    //         })
    //         .catch(error => {
    //             setError(error);
    //             setIsLoading(false);
    //         });
    // }, []);


    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/menuitems');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMenuItems(data);
                setError(null); // Clear any previous errors
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };
    
        // Fetch menu items initially
        fetchMenuItems();
    
        // Polling mechanism to fetch menu items every 10 seconds
        const interval = setInterval(fetchMenuItems, 25000);
    
        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);


    

    if (isLoading) {
        return <div className="text-center text-lg font-bold">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-600 text-center text-lg font-bold">Error: {error.message}</div>;
    }

    // Group menu items by category
    const groupedMenuItems = menuItems.reduce((acc, item) => {
        if (item.category === 1 || item.category === 2 || item.category === 5) {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
        }
        return acc;
    }, {});

    // Function to split menu items into two columns
    const splitIntoColumns = (items) => {
        const middleIndex = Math.ceil(items.length / 2);
        const firstHalf = items.slice(0, middleIndex);
        const secondHalf = items.slice(middleIndex);
        return [firstHalf, secondHalf];
    };

    return (
        <div className="min-h-screen max-h-screen bg-black text-white p-6">
            {Object.keys(groupedMenuItems).map(category => (
                <div key={category} className="menu-category">
                    <div className="text-2xl font-bold uppercase pb-2 border-b border-gray-200 flex items-center">
                        {category === '1' && (
                            <>
                                <span>HotDogs/Corndogs</span>
                                <div className="ml-2">
                                    <Image
                                        src="/menu_board_icons/hotdogs_icon.jpeg"
                                        alt="Hotdogs Icon"
                                        className="object-cover rounded-lg"
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </>
                        )}
                        {category === '2' && (
                            <>
                                <span>Chicken Tenders</span>
                                <div className="ml-2 mt-4">
                                    <Image
                                        src="/menu_board_icons/tendersm_icon.jpeg"
                                        alt="Tenders Icon"
                                        className="object-cover rounded-lg"
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </>
                        )}
                        {category === '5' && (
                            <>
                                <span>Beverages</span>
                                <div className="ml-2 mt-4">
                                    <Image
                                        src="/menu_board_icons/beveragesm_icon.jpeg"
                                        alt="Beverages Icon"
                                        className="object-cover rounded-lg"
                                        width={25}
                                        height={25}
                                    />
                                </div>
                            </>
                        )}
                    </div>


                    



                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {/* Using grid layout for menu items */}
                        {groupedMenuItems[category].map(item => (
                            <div key={item.id} className="bg-gray-800 p-1.5 rounded-lg shadow-md flex border border-gray">
                                <Image
                                    src={`/menuItems/${item.itemname.replace(/\s+/g, '')}.jpeg`}
                                    alt={item.itemname}
                                    className="object-cover rounded-lg"
                                    width={85}
                                    height={85}
                                />
                                <div className="ml-4">
                                    <div className="text-lg font-bold">{item.itemname}</div>
                                    <div className="text-sm">{item.description}</div>
                                    <div className="text-lg font-bold mt-2">${item.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


const HomePage = () => {
    return (
        <div className="min-h-screen max-h-screen overflow-hidden text-white">
            <div className="bg-[#800000] text-white text-center text-3xl font-bold p-1">Rev&apos;s Menu</div>
            <MenuBoard />
        </div>
    );
};

export default HomePage;
