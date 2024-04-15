"use client";

import "../../globals.css";
import React, { useEffect, useState } from 'react';

const MenuBoard = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/menuitems')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setMenuItems(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Group menu items by category
    const groupedMenuItems = menuItems.reduce((acc, item) => {
        if (item.category === 0  ) {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
        }
        return acc;
    }, {});

    // A function to split menu items into two columns
    const splitIntoColumns = (items) => {
        const middleIndex = Math.ceil(items.length / 2);
        const firstHalf = items.slice(0, middleIndex);
        const secondHalf = items.slice(middleIndex);
        return [firstHalf, secondHalf];
    };
    
    return (
        <div className="menu_board">
        {/* Display menu items grouped by category */}
        {Object.keys(groupedMenuItems).map(category => (
            <div key={category} className="category_container">
                <div className="menu-category-title">
                    {category === '0' && 'Burgers'}
                </div>
                <div className="menu_items_container">
                    <div className="menu_column">
                        {splitIntoColumns(groupedMenuItems[category])[0].map(item => (
                            <div key={item.id} className="menu_item">
                                <div className="item_details">
                                    <div className="item_name">{item.itemname}</div>
                                    <div className="item-description">{item.description}</div>
                                </div>
                                <div className="item_price">${item.price}</div>
                            </div>
                        ))}
                    </div>
                    <div className="menu_column">
                        {splitIntoColumns(groupedMenuItems[category])[1].map(item => (
                            <div key={item.id} className="menu_item">
                                <div className="item_details">
                                    <div className="item_name">{item.itemname}</div>
                                    <div className="item-description">{item.description}</div>
                                </div>
                                <div className="item_price">${item.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>

    );
    
};


const HomePage = () => {
    return (
        <div>
            <div className="menu-main-title">Rev's Menu</div>
            <MenuBoard />
        </div>
    );
};

export default HomePage;
