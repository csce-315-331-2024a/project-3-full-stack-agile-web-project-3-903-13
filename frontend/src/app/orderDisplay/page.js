"use client";

import "../globals.css";
import React, { useEffect, useState } from 'react';
import axios from "axios";

const OrderDisplayPage = () => {
    const [ordersInPreparation, setOrdersInPreparation] = useState([]);
    const [ordersToCollect, setOrdersToCollect] = useState([]);

    // Fetch in-progress orders from the backend
    const fetchInProgressOrders = async () => {
        try {
          const response = await axios.get(
            "https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/transactions/inProgressOrders"
          );
          setOrdersInPreparation(response.data);
        } catch (error) {
          console.error("Error fetching in-progress orders:", error);
        }
      };
    
      const fetchRecentFulfilledOrders = async () => {
        try {
          const response = await axios.get(
            "https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/transactions/recentFulfilledOrders"
          );
          setOrdersToCollect(response.data);
        } catch (error) {
          console.error("Error fetching recent fulfilled orders:", error);
        }
      };

    useEffect(() => {
        fetchInProgressOrders();
        fetchRecentFulfilledOrders();
        const intervalId = setInterval(() => {
            fetchInProgressOrders();
            fetchRecentFulfilledOrders();
        }, 10000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="order-display-page flex h-screen" role="main" >
            <section className="preparing-section w-1/2 bg-gray-200 p-10" aria-labelledby="preparing-heading" >
                <h1 className="text-3xl font-bold underline mb-10">Preparing...</h1>
                {ordersInPreparation.map(order => (
                    <p key={order.transactionid} className="text-4xl font-bold mb-4">
                        #{String(order.transactionid).padStart(3, '0')}
                    </p>
                ))}
            </section>

            <section className="collect-section w-1/2 bg-gray-100 p-10" aria-labelledby="collect-heading" >
                <h1 className="text-3xl font-bold underline mb-10 text-green-600">Please Collect</h1>
                {ordersToCollect.map(order => (
                    <p key={order.transactionid} className="text-4xl font-bold mb-4">
                        #{String(order.transactionid).padStart(3, '0')}
                    </p>
                ))}
            </section>
        </div>
    );
};

export default OrderDisplayPage;