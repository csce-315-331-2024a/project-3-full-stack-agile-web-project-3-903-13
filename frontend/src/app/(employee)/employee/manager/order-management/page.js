"use client";

import React, { useEffect, useState } from "react";
import TransactionModal from "@/components/transactions/TransactionModal";
import { useSearchParams } from 'next/navigation'

const formatTime = (isoDateString) => {
    const date = new Date(isoDateString);

    const options = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "America/Chicago",
    };

    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
};

export default function OrderManagementPage() {
    const [transactionID, setTransactionID] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [option, setOption] = useState("transactionID");

    const [loading, setLoading] = useState("");
    const [transactionsData, setTransactionsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const FindTransaction = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            
            if (option === "transactionID") {
                setStartDate("");
                setEndDate("");
                const response = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/transactions/getTransactionByID", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ transactionID: transactionID }),
                    }
                );
                if (!response.ok){
                    const errorMessage = await response.text()
                    throw new Error(errorMessage)
                }

                const tempdata = await response.json();
                const data = [tempdata];

                setTransactionsData(data);
            } else {
                setTransactionID("");

                if (startDate > endDate){
                    throw new Error("Start date can not be after end date")
                }

                const response = await fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/transactions/getTransactionsByPeriod",{
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            startDate: startDate,
                            endDate: endDate,
                        }),
                    }
                );

                if (!response.ok){
                    const errorMessage = await response.text()
                    throw new Error(errorMessage)
                }

                const tempdata = await response.json();
                setTransactionsData(tempdata);
            }
        } catch (error) {
            setTransactionsData("")
            setErrorMessage(error.message)
        }

        setLoading(false);
    };

    const formSubmit = (e) => {
        e.preventDefault();
        FindTransaction();
    };

    const handleTransactionClick = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <main className="min-h-screen min-w-screen-lg bg-slate-100">
            <h1 className="text-4xl font-bold mb-3 text-center py-4">
                Order Management
            </h1>

            <form onSubmit={formSubmit}>
                <div className="max-w-md mx-auto bg-white p-5 rounded-lg shadow-md">
                    <div className="mb-3">
                        <label className="block text-base font-medium text-gray-700">
                            Option:
                        </label>
                        <select
                            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={option}
                            onChange={(e) => setOption(e.target.value)}
                        >
                            <option value="transactionID">
                                By Order ID
                            </option>
                            <option value="duration"> By Period </option>
                        </select>
                    </div>

                    {option === "transactionID" ? (
                        <div>
                            <label className="block text-base font-medium text-gray-700">
                                Enter Order ID:
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={transactionID}
                                onChange={(e) =>
                                    setTransactionID(e.target.value)
                                }
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-base font-medium text-gray-700">
                                Start Date:
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="my-1 w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <label className="block text-base font-medium text-gray-700">
                                End Date:
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="my-1 w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-md font-semibold"
                    >
                        {" "}
                        {loading ? "Loading..." : "Find"}{" "}
                    </button>
                    
                    {errorMessage.length > 0 && (
                        <div className = "mt-3 text-red-500 font-semibold"> {errorMessage} </div>
                    )}

                </div>
            </form>

            <div className="mt-7 max-h-[400px] max-w-[70%] mx-auto overflow-y-auto">
                {transactionsData.length > 0 && (
                    <div className="flex flex-col gap-4 p-4">
                        {transactionsData.map((item, index) => (
                            <div key={index}>
                                <div
                                    onClick={() => handleTransactionClick(item)}
                                    className="flex justify-between bg-slate-400 p-4 rounded-md cursor-pointer hover:bg-slate-600 hover:text-white"
                                >
                                    <div>
                                        <p className="text-lg font-semibold">
                                            Order #{item.transactionid}{" "}
                                        </p>
                                        <p className="text-sm">${item.cost.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        {" "}
                                        {formatTime(item.transactiontime)}{" "}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                transaction={selectedTransaction}
                alltransactionData={transactionsData}
                setAllData={setTransactionsData}
            />
        </main>
    );
}
