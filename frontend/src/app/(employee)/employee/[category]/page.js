"use client";

import { useEffect, useState } from "react";
import {MenuItemList} from "./menuItems";


const categories = [
    "burgers",
    "hotdogs",
    "tenders",
    "fries",
    "ice-cream",
    "beverages",
    "seasonal"
]


/**
 * EmployeePOSPage is a React component that displays the point of sale interface for employees.
 * It dynamically loads menu items based on the category specified in the URL parameters.
 * This component uses the `MenuItemList` to render the items of the specified category.
 *
 * @component
 * @module TransactionPanelEmployee/Page
 * @param {Object} props - Component props.
 * @param {Object} props.params - URL parameters containing the category of menu items.
 * @returns {React.Component} A main section with a background and a `MenuItemList` that
 *           displays items for the selected category in the Employee Point of Sale system.
 */
export default function EmployeePOSPage({params}) {
    const index = categories.indexOf(params.category);
    const name = categories[index].slice(0, 1).toUpperCase() + categories[index].slice(1)
    return (
        <main className="min-h-screen bg-cream py-1" aria-label={`Employee Point of Sale for ${name}`}>
            <MenuItemList
                categoryNum={index}
                categoryName={name}
            />
        </main>
    );
}
