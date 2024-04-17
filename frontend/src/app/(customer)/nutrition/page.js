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
    

    return (
        <div className="nutrition-page">
            <div className="header">
                <h1>Allergens & Special Diets</h1>
                <p className="description">Explore our menu options tailored for all dietary restrictions. We offer a variety of choices to ensure everyone can enjoy their meal.</p>
            </div>
            <div className="menu-items">
                {menuItems.map(item => (
                    <div key={item.menuid} className="menu-item">
                        <div className="menu-item-name">{item.itemname}</div>
                        <div className="calories">{item.Calories} cal</div>
                        <div className="diet">{mapSpecialDiet(item.specialdiet)}</div>
                        <div className="allergy">{mapAllergies(item.allergy)}</div>
                    </div>
                ))}
            </div>
            <style jsx>{`
                .nutrition-page {
                    max-width: 1000px;
                    margin: auto;
                    padding: 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #f4f4f4;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }

                h1 {
                    color: #2a2f36;
                    margin-bottom: 8px;
                }

                .description {
                    color: #666;
                    font-size: 16px;
                    max-width: 80%;
                    margin: auto;
                    line-height: 1.6;
                }

                .menu-items {
                    margin-top: 20px;
                }

                .menu-item {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr;
                    gap: 10px;
                    align-items: center;
                    margin-bottom: 10px;
                    padding: 10px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    transition: background-color 0.3s;
                }

                .menu-item:hover {
                    background-color: #eaeaea;
                }

                .menu-item-name {
                    font-weight: bold;
                }

                .calories, .diet, .allergy {
                    text-align: center;
                    padding: 5px;
                }

                .diet-symbol, .allergy-symbol {
                    width: 40px;
                    height: 40px;
                }
            `}</style>
        </div>
    );
}

export default NutritionPage;