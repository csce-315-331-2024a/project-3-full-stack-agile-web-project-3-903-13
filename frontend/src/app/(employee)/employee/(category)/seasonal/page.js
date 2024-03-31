"use client";

import { useEffect, useState } from "react";

import {MenuItem} from "../menuItems";

export default function SeasonalPage() {
    return (
        <main className="min-h-screen bg-cream py-10">
            <MenuItem
                categoryNum={6}
                categoryName={"Seasonal"}
            />
        </main>
    );
}
