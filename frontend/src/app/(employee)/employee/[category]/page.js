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



export default function EmployeePOSPage({params}) {
    const index = categories.indexOf(params.category);

    return (
        <main className="min-h-screen bg-cream py-10">
            <MenuItemList
                categoryNum={index}
                categoryName={params.category}
            />
        </main>
    );
}
