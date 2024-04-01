"use client";

import { useEffect, useState } from "react";

import {MenuItemList} from "../menuItems";

export default function IceCreamPage() {
    return (
        <main className="min-h-screen bg-cream py-10">
            <MenuItemList
                categoryNum={4}
                categoryName={"Ice Cream"}
            />
        </main>
    );
}
