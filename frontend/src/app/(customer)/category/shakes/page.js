"use client";
import { useEffect, useState } from 'react';

const shakes = () => {
    const [shakes, setshakes] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            const response = await fetch('http://localhost:5000/api/menuitems');
            const data = await response.json();
            const shakeItems = data.filter(item => item.category === 4);
            setshakes(shakeItems);
        };

        fetchMenuItems();
    }, []);

    return (
        <main className="min-h-screen bg-cream py-10">
            <div className="container mx-auto"> 
                <h1 className="text-3xl font-bold text-center mb-8">Shakes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shakes.map((shake) => (
                        <div key={shake.menuID} className="relative bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out aspect-square">
                            <img
                                src={"/* IDK HOW TO GET THIS TO WORK */"}
                                alt={shake.itemname}
                                className="object-cover w-full h-full rounded-lg"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end p-4">
                                <h5 className="text-xl font-bold text-gray-900 text-center">{shake.itemname}</h5>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default shakes;
