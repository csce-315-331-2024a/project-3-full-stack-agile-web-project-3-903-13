/**
 * @module OrderDisplay/Page
 * @description Page component responsible for displaying orders in various states.
 */
"use client";

import "../globals.css";
import React, { useEffect, useState } from 'react';
import axios from "axios";

/**
 * Component for displaying orders that are either in preparation or ready to collect.
 * Fetches and updates the display of orders at regular intervals.
 *
 * @function OrderDisplayPage
 * @returns {React.Component} A component showing orders in preparation and orders ready for collection.
 */
const OrderDisplayPage = () => {
    const [ordersInPreparation, setOrdersInPreparation] = useState([]);
    const [ordersToCollect, setOrdersToCollect] = useState([]);

    /**
     * Fetches orders that are currently being prepared from the backend.
     * @async
     * @memberOf module:OrderDisplay/Page
     */
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
    
    /**
     * Fetches recently fulfilled orders from the backend.
     * @async
     * @memberOf module:OrderDisplay/Page
     */
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
                    <p key={order.transactionid} className="text-2xl font-bold mb-2">
                        #{String(order.transactionid).padStart(3, '0')}
                    </p>
                ))}
            </section>

            <section className="collect-section w-1/2 bg-gray-100 p-10" aria-labelledby="collect-heading" >
                <h1 className="text-3xl font-bold underline mb-10 text-green-600">Please Collect</h1>
                {ordersToCollect.map(order => (
                    <p key={order.transactionid} className="text-2xl font-bold mb-2">
                        #{String(order.transactionid).padStart(3, '0')}
                    </p>
                ))}
            </section>
        </div>
    );
};

export default OrderDisplayPage;