"use client";

import { useEffect, useState } from "react";

import {MenuItemList} from "../menuItems";

export default function BeveragesPage() {
    return (
        <main className="min-h-screen bg-cream py-10">
            <MenuItemList
                categoryNum={5}
                categoryName={"Beverages"}
            />
        </main>
    );
}
