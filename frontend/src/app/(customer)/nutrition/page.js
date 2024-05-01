"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * NutritionPage is a React component that displays nutritional information about menu items.
 * It provides details such as calories and special dietary symbols (e.g., vegetarian, pescatarian, gluten-free)
 * for each item. It fetches menu item data from a backend API and renders a list with nutritional and dietary information.
 *
 * @component
 * @module NutritionPage
 * @returns {React.Component} The NutritionPage component, which includes dietary legends and a list of menu items with nutritional details.
 */
const NutritionPage = () => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems');
            setMenuItems(response.data);
          } catch (error) {
            console.error("Error fetching menu items:", error);
          }
        };
    
        fetchData();
      }, []);

    /**
     * Maps a diet code to its corresponding symbol element(s) for display.
     *
     * @function
     * @memberOf module:NutritionPage
     * @param {number} dietCode - The code representing a specific diet (e.g., vegetarian, pescatarian).
     * @returns {React.Element} A React component or element representing the diet symbol(s).
     */
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

    /**
     * Maps an allergy code to its corresponding symbol element for display.
     *
     * @function
     * @memberOf module:NutritionPage
     * @param {number} allergyCode - The code representing a specific allergy (e.g., gluten-free).
     * @returns {React.Element} A React component or element representing the allergy symbol.
     */
    const mapAllergies = (allergyCode) => {
        if (allergyCode === 0) {
            return <img src="/gluten-free.png" alt="Gluten Free" className="allergy-symbol" width={40} height={40}></img>;
        }
        return '';
    };
    
    /**
     * Legend is a React component that displays a legend of dietary symbols used on the page.
     * It helps users identify what each symbol means with respect to dietary restrictions such as vegetarian,
     * pescatarian, and gluten-free diets. Each symbol is accompanied by a text label for clarity.
     *
     * @function Legend
     * @memberOf module:NutritionPage
     * @returns {React.Component} A component that visually represents the legend for dietary symbols,
     * including vegetarian, pescatarian, and gluten-free options.
     */
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
        <div className="max-w-4xl mx-auto p-5 bg-gray-100 rounded-lg shadow-sm" role="main" >
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
                    role="listitem" 
                    aria-label={`${item.itemname}, ${item.Calories} calories, ${mapSpecialDiet(item.specialdiet)}${mapAllergies(item.allergy) ? ', Gluten Free' : ''}`}
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