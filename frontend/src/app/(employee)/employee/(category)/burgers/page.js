"use client";

import { useEffect, useState } from "react";

import {MenuItemList} from "../menuItems";

export default function BurgersPage() {
    return (
        <main className="min-h-screen bg-cream py-10">
            <MenuItemList
                categoryNum={0}
                categoryName={"Burgers"}
            />
        </main>
    );
}
