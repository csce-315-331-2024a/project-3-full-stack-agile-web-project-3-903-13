"use client";

import "../../globals.css";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

const MenuBoard = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems');
                setMenuItems(response.data);
                setError(null);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenuItems();

        const interval = setInterval(fetchMenuItems, 15000);

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
        if (item.category === 0) {
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
        <div className="min-h-screen max-h-screen bg-white p-6 grid grid-cols-2 gap-3 overflow-hidden">
            {Object.keys(groupedMenuItems).map(category => (
                <div key={category} className="col-span-2">
                    <div className="text-2xl font-bold uppercase flex items-center pb-2 ">
                        <span className="uppercase text-black">{category === '0' && 'Burgers'}</span>

                        <div className="ml-2">
                            <Image
                                src="/menu_board_icons/burgersm_icon.jpeg"
                                alt="Burgers Icon"
                                className="object-cover rounded-lg"
                                width={25}
                                height={25}
                            />
                        </div>

                    </div>


                    <div className="grid grid-cols-2 gap-4 ">

                        {splitIntoColumns(groupedMenuItems[category]).map((column, index) => (
                            <div key={index} className="menu_column">
                                {column.map(item => (
                                    <div key={item.id} className="bg-[#800000] p-1.5 rounded-lg shadow-md flex border border-4 border-gray-800">

                                        <Image
                                            src={`/menuItems/${item.itemname.replace(/\s+/g, '')}.jpeg`}
                                            alt={item.itemname}
                                            className="object-cover rounded-lg"
                                            width={85}
                                            height={85}
                                        />
                                        <div className="ml-4">
                                            <div className="text-lg text-white font-bold">{item.itemname}</div>
                                            <div className="text-sm text-white">{item.description}</div>
                                            <div className="text-lg text-white font-bold mt-2">${item.price}</div>
                                        </div>
                                    </div>
                                ))}
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
