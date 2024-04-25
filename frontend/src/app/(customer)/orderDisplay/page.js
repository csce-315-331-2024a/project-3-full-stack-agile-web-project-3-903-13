"use client";

import React, { useEffect, useState } from 'react';

const OrderDisplayPage = () => {
    const [ordersInPreparation, setOrdersInPreparation] = useState([]);
    const [ordersToCollect, setOrdersToCollect] = useState({});

    // Fetch in-progress orders from the backend
    const fetchInProgressOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/transactions/inProgressOrders');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setOrdersInPreparation(data);
        } catch (error) {
            console.error("Error fetching in-progress orders:", error);
        }
    };

    useEffect(() => {
        fetchInProgressOrders();
        const intervalId = setInterval(fetchInProgressOrders, 10000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="order-display-page flex h-screen">
            <section className="preparing-section w-1/2 bg-gray-200 p-10">
                <h1 className="text-3xl font-bold underline mb-10">Preparing...</h1>
                {ordersInPreparation.map(order => (
                    <p key={order.transactionid} className="text-4xl font-bold mb-4">
                        #{String(order.transactionid).padStart(3, '0')}
                    </p>
                ))}
            </section>

            <section className="collect-section w-1/2 bg-gray-100 p-10">
                <h1 className="text-3xl font-bold underline mb-10 text-green-600">Please Collect</h1>
                {Object.keys(ordersToCollect).map(transactionId => (
                    <p key={transactionId} className="text-4xl font-bold mb-4">
                        #{String(transactionId).padStart(3, '0')}
                    </p>
                ))}
            </section>
        </div>
    );
};

export default OrderDisplayPage;
