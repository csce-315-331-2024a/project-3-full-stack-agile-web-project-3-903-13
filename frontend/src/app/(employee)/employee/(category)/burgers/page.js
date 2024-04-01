"use client";

import { useEffect, useState } from "react";

import { TransactionProvider } from "../transactions";

import {MenuItemList} from "../menuItems";

export default function BurgersPage() {
    return (
        <TransactionProvider>
        <main className="min-h-screen bg-cream py-10">
            <MenuItemList
                categoryNum={0}
                categoryName={"Burgers"}
            />
        </main>
        </TransactionProvider>
    );
}
