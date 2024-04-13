"use client";

import { useEffect, useState } from "react";

import {MenuItemList} from "./menuItems";
import { useSearchParams } from 'next/navigation'


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
    const name = categories[index].slice(0, 1).toUpperCase() + categories[index].slice(1)

    const searchParams = useSearchParams()
    console.log(searchParams.get('id')) // Logs "search"


    return (
        <main className="min-h-screen bg-cream py-1">
            <MenuItemList
                categoryNum={index}
                categoryName={name}
            />
        </main>
    );
}
