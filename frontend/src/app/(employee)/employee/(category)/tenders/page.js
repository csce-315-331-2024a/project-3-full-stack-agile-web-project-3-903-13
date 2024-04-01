"use client";

import { useEffect, useState } from "react";

import {MenuItemList} from "../menuItems";

export default function TendersPage() {
    return (
        <main className="min-h-screen bg-cream py-10">
            <MenuItemList
                categoryNum={2}
                categoryName={"Tenders"}
            />
        </main>
    );
}
