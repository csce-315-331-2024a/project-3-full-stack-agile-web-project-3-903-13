"use client"
import React from "react";

import { useEffect, useState, useContext } from "react";

import { TransactionContext, TransactionProvider, useTransaction } from "../transactions";

// orderInfo contains two objects
export default function CartPage() {
    const { transactions, updateTransaction, clearTransaction, submitTransaction } = useTransaction();
    const [transactionsList, setTransactionsList] = useState(null);
    useEffect(() => {
        setTransactionsList(transactions)
    }, [transactions])


    return (
        <div className="max-w-sm border-2 border-black rounded overflow-hidden shadow-lg mr-5 flex flex-col justify-between items-center">
            <div> Cart </div>

            <div className="flex flex-col justify-evenly items-center">
                {transactionsList ? transactionsList.map((item, index) => {
                    return <div key={index} className="items-center">{item.itemname} x{item.quantity} ${item.price}</div>
                }) : <div className="flex flex-col items-center">No items in current transaction!</div>}
            </div>
            <div className="px-6 pt-4 pb-2 flex flex-col items-center">
                <h1>Price: {
                    transactionsList ? "$" + transactionsList.reduce((total, currentItem) => { return total + currentItem.price * currentItem.quantity }, 0).toFixed(2) : "$0.00"
                }</h1>
            </div>

            <div className="px-6 pt-4 pb-2 flex flex-col items-center">
                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={clearTransaction}>
                    Clear Transaction
                </button>
                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={submitTransaction}>
                    Charge
                </button>
            </div>
        </div>

    )
}