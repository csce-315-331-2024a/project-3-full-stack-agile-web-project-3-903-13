"use client";

import { useEffect, useState } from "react";

import {MenuItemList} from "../menuItems";

export default function FriesPage() {
    return (
        <main className="min-h-screen bg-cream py-10">
            <MenuItemList
                categoryNum={3}
                categoryName={"Fries"}
            />
        </main>
    );
}
