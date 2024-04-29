"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'


export default function KitchenStatePage() {
    const [currentOrders, setCurrentOrders] = useState([]);

    useEffect(() => {

        const fetchCurrentOrders = async () => {
            const response = await fetch('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/transactions/inProgressOrders');
            const data = await response.json();
            setCurrentOrders(data);
        };

        fetchCurrentOrders()

    }, [currentOrders])

    const handleCompleteClick = async (transaction) => {
        try {
            const response = await fetch(`https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/transactions/fulfillOrder`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ transactionID: transaction.transactionid })
            });
        }
        catch (error) {
            console.log(error)
        }
    }



    return (
        <main className="min-h-screen min-w-screen-lg bg-slate-100">
            <h1 className="text-4xl font-bold mb-1 text-center py-4">
                Kitchen
            </h1>

            {currentOrders.length === 0 ? (
                <div className="text-xl my-1 font-semibold text-center py-4 text-yellow-400"> No orders in kitchen right now. Get some!! </div>
            ) : (
                <div className="text-xl my-1 font-semibold text-center py-4 text-green-400"> Orders in the kitchen. Get working!! </div>
            )}

            <div className="grid grid-cols-3 gap-4 max-w-[70%] mx-auto">
                {currentOrders.map(order => (
                    <div key={order.transactionid} className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between">
                        <h1 className="text-lg font-bold pb-2">Order #{order.transactionid}</h1>
                        {order.components.map((item, index) => (
                            
                            <div>
                                <div key={index} className="flex justify-between">
                                    <div> {item.itemname}</div>
                                    <div> &#215;{item.quantity} </div>
                                </div>
                                <div className="text-xs"> {item.modif && item.modif.slice(0, item.modif.length - 1)} </div>
                            </div>
                        ))

                        }

                        <div className="flex flex-row justify-between items-center mt-4">
                            <button
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded my-2"
                                onClick={() => handleCompleteClick(order)}
                                aria-label={`Complete order ${order.transactionid}`}
                            >
                                Complete
                            </button>
                            <Link
                                href={{
                                    pathname: '/employee/update',
                                    query: {
                                        'status': order.status,
                                        'id': order.transactionid
                                    }
                                }}
                            >
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    aria-label={`Update order ${order.transactionid}`}
                                >
                                    Update
                                </button>
                            </Link>
                        </div>



                    </div>
                ))}
            </div>


        </main>

    )
}