import React from "react";

import { useEffect, useState } from "react";

function MenuItem(props) {
    const sendToTransaction = () => {
        console.log(props.item.itemname)
        console.log(props.item.menuid)
        console.log(props.item.price)
    }

    return (
        <div className="relative bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out aspect-square" onClick={sendToTransaction}>
            <img
                alt={props.item.itemname}
                className="object-cover w-full h-full rounded-lg"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h5 className="text-xl font-bold text-gray-900 text-center">{props.item.itemname}</h5>
            </div>
        </div>
    )
}

export function MenuItemList({categoryNum, categoryName}) {
    const [itemType, setItemType] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            const response = await fetch('http://localhost:5000/api/menuitems');
            const data = await response.json();
            const items = data.filter(item => item.category === parseInt(categoryNum))
            setItemType(items);
        };

        fetchMenuItems();
    }, []);

  return (
    <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">{categoryName}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemType.map((item) => (
                <MenuItem 
                    item={item}
                />
            ))}
        </div>
    </div>
  );
}

