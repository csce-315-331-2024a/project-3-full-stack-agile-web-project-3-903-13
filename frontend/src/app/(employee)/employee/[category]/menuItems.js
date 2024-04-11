import React from "react";

import { useEffect, useState, useContext } from "react";

import { TransactionContext, TransactionProvider, useTransaction } from "@/components/TransactionContext";

function TransactionPanel() {
    const { transactions, updateTransaction, clearTransaction, submitTransaction, removeItemCompletely } = useTransaction();
    const [transactionsList, setTransactionsList] = useState(null);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);

    useEffect(() => {
        setTransactionsList(transactions);
    }, [transactions]);

    const handlePayment = () => {
        submitTransaction();
        setShowPaymentOptions(false);
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        const updatedItem = transactions.find(item => item.id === itemId);
        if (updatedItem) {
            updatedItem.quantity = newQuantity;
            updateTransaction(updatedItem);
        }
    };

    return (
        <div className="w-96 min-h-[200px] max-h-[80vh] border-2 border-gray-300 rounded-lg shadow-lg mr-5 flex flex-col">
            <div className="px-6 py-4 border-b">
                <div className="font-bold text-xl mb-2">Current Sale</div>
            </div>
            <div className="flex-1 overflow-auto">
                {transactionsList && transactionsList.length > 0 ? (
                    transactionsList.map((item, index) => (
                        <div key={index} className="flex flex-col bg-white p-3 my-2 mx-4 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold truncate">{item.itemname}</span>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="1000"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                className="range range-xs h-3" // Adjust the height with h-2, h-3, etc.
                                style={{ cursor: 'pointer' }} // Ensure the slider thumb is easy to grab
                            
                            />
                            <div className="flex justify-between">
                                <span>Quantity: {item.quantity}</span>
                                <button onClick={() => removeItemCompletely(item.id)} className="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-6 py-4 text-center">No items in current transaction!</div>
                )}
            </div>
            <div className="px-6 py-4">
                <div className="font-semibold text-lg">
                    Total Price: $
                    {transactionsList ? transactionsList.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2) : "0.00"}
                </div>
            </div>
            <div className="px-6 py-4 flex flex-col space-y-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow" onClick={clearTransaction}>
                    Clear Transaction
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow" onClick={() => setShowPaymentOptions(true)}>
                    Charge
                </button>
            </div>

            {/* Payment options modal */}
            {showPaymentOptions && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-semibold text-center mb-4">Select Payment Method</h3>
                        <ul className="space-y-4">
                            <li>
                                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300" onClick={handlePayment}>
                                    Card
                                </button>
                            </li>
                            <li>
                                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300" onClick={handlePayment}>
                                    Dining Dollars
                                    </button>
                            </li>
                            <li>
                                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300" onClick={handlePayment}>
                                    Retail Swipe
                                </button>
                            </li>
                        </ul>
                        <div className="text-right mt-4">
                            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded shadow" onClick={() => setShowPaymentOptions(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function MenuItem(props) {
    const { updateTransaction, transactions } = useTransaction();
    const sendToTransaction = () => {
        var quantity = 0
        if (transactions) {
            transactions.forEach(item => {
                if (props.item.menuid == item.id) {
                    quantity = item.quantity + 1
                }
            }); 
        }
        if (quantity == 0) {
            quantity += 1
        }
        updateTransaction({"id": props.item.menuid, "itemname": props.item.itemname, "price": props.item.price, "quantity": quantity})
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
    <div className="flex flex-row">
        <div className="container mx-auto mr-5">
            <h1 className="text-3xl font-bold text-center mb-8">{categoryName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {itemType.map((item) => (
                    <MenuItem 
                        item={item}
                    />
                ))}
            </div>
        </div>
        <TransactionPanel/>
    </div>
  );
}

