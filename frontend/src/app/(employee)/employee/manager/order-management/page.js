"use client";

import React, { useEffect, useState } from "react";
import TransactionModal from "@/components/transactions/TransactionModal";

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
        <main className="min-h-screen flex flex-col min-w-screen-lg bg-slate-100">
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
                            data-testid = "option-select"
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
                                data-testid ="order-id-input"
                                type="text"
                                className="mt-1 w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={transactionID}
                                onChange={(e) =>
                                    setTransactionID(e.target.value)
                                }
                                aria-label="Enter order ID"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-base font-medium text-gray-700">
                                Start Date:
                            </label>
                            <input
                                data-testid = "start-date"
                                type="date"
                                id="start-date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="my-1 w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                aria-label="Select start date"
                            />
                            <label className="block text-base font-medium text-gray-700">
                                End Date:
                            </label>
                            <input
                                data-testid = "end-date"
                                type="date"
                                id="end-date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="my-1 w-full p-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                required
                                aria-label="Select end date"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold"
                        aria-label="Submit form"
                    >
                        {" "}
                        {loading ? "Loading..." : "Find"}{" "}
                    </button>
                    
                    {errorMessage.length > 0 && (
                        <div className = "mt-3 text-red-500 font-semibold"> {errorMessage} </div>
                    )}

                </div>
            </form>

            <div className="mx-auto mt-7 max-h-[400px] min-w-[50%] overflow-y-auto">
                {transactionsData.length > 0 && (
                    <div className="flex flex-col gap-4 p-4 w-full"  aria-live="polite">
                        {transactionsData.map((item, index) => (
                            <div key={index}>
                                <div
                                    onClick={() => handleTransactionClick(item)}
                                    className="flex justify-between bg-slate-400 p-4 rounded-md cursor-pointer hover:bg-slate-600 hover:text-white"
                                    aria-label={`Transaction ID: ${item.transactionid}, Cost: $${item.cost.toFixed(2)}, Time: ${formatTime(item.transactiontime)}`}
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
