"use client";

import React, { useState, useEffect } from 'react';

const NutritionPage = () => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/menuitems')
            .then(response => response.json())
            .then(data => {
                setMenuItems(data);
            })
            .catch(error => {
                console.error("Error fetching menu items:", error);
            });
    }, []);

    // A function to map special diet numbers to text
    const mapSpecialDiet = (dietCode) => {
        switch (dietCode) {
            case 1:
                return <img src="/vegetarian.svg" alt="Vegetarian" className="diet-symbol" width={40} height={40}></img>;
            case 2:
                return <img src="/pescatarian.png" alt="Pescatarian" className="diet-symbol" width={40} height={40}></img>;
            case 3:
                return (
                    <div className="flex">
                        <img src="/vegetarian.svg" alt="Vegetarian" className="diet-symbol" width={40} height={40}></img>
                        <img src="/pescatarian.png" alt="Pescatarian" className="diet-symbol" width={40} height={40}></img>
                    </div>
                );
            default:
                return '';
        }
    };

    // A function to map allergy numbers to text
    const mapAllergies = (allergyCode) => {
        if (allergyCode === 0) {
            return <img src="/gluten-free.png" alt="Gluten Free" className="allergy-symbol" width={40} height={40}></img>;
        }
        return '';
    };
    
    const Legend = () => {
        return (
            <div className="my-10 p-4 bg-white rounded shadow-lg flex justify-around items-center" aria-label="Legend of Symbols">
                <div className="grid grid-cols-3 gap-4 items-center" aria-label = "Vegetarian Option">
                    <div className="flex items-center">
                        <img src="/vegetarian.svg" alt="Vegetarian" width={24} height={24} />
                        <span className="ml-2 text-gray-600">Vegetarian</span>
                    </div>
                    <div className="flex items-center" aria-label = "Pescatarian Option">
                        <img src="/pescatarian.png" alt="Pescatarian" width={24} height={24} />
                        <span className="ml-2 text-gray-600">Pescatarian</span>
                    </div>
                    <div className="flex items-center" aria-label ="Gluten Free Option" >
                        <img src="/gluten-free.png" alt="Gluten Free" width={24} height={24} />
                        <span className="ml-2 text-gray-600">Gluten Free</span>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="max-w-4xl mx-auto p-5 bg-gray-100 rounded-lg shadow-sm">
            <div className="text-center mb-5">
                <h1 className="text-2xl text-gray-800 mb-2">Allergens & Special Diets</h1>
                <p className="text-gray-600 text-base max-w-xl mx-auto leading-relaxed">
                    Explore our menu options tailored for all dietary restrictions. We offer a variety of choices to ensure everyone can enjoy their meal.
                </p>
            </div>
            <Legend />
            <div className="mt-5">
                {menuItems.map((item, index) => (
                    <div key={item.menuid} className={`grid grid-cols-4 gap-2 items-center mb-2 p-2 rounded-lg shadow ${index % 2 === 0 ? "bg-white" : "bg-gray-200"}`}
                    style={index % 2 === 0 ? { border: '2px solid #800000' } : {} }
                    role="listitem" aria-label={`${item.itemname}, ${item.Calories} calories, ${mapSpecialDiet(item.specialdiet)}${mapAllergies(item.allergy) ? ', Gluten Free' : ''}`}
                    >
                        <div className="font-bold col-span-1">{item.itemname}</div>
                        <div className="text-center col-span-1">{item.Calories} cal</div>
                        <div className="text-center col-span-1">{mapSpecialDiet(item.specialdiet)}</div>
                        <div className="text-center col-span-1">{mapAllergies(item.allergy)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}


export default NutritionPage;