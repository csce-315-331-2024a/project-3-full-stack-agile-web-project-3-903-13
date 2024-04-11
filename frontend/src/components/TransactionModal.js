import React, { useState } from "react";

export default function TransactionModal({ isOpen, onClose, transaction, alltransactionData, setAllData }) {
    if (!isOpen) return null;

    const [deleteMessage, setDeleteMessage] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");


    const handleDelete = async () => {
        try{
            const response = await fetch("http://localhost:5000/api/transactions/deletetransaction", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({transactionID: transaction.transactionid, components: transaction.components}),
        });
        }
        catch (error){
            console.log(error)
        }
        
        if (alltransactionData.length === 1){
            setAllData("")
        } else {
            const indexToDelete = alltransactionData.findIndex(item => item.transactionid === transaction.transactionid);
            if (indexToDelete !== -1) {
                // Use the splice method to remove the item at the specified index
                alltransactionData.splice(indexToDelete, 1);
            }
            setAllData(alltransactionData)
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative">
                <div className="bg-white p-12 rounded-lg shadow-lg">
                    <button
                        className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <div className="w-96">
                        <h2 className="text-2xl font-bold mb-4">
                            Transaction Details
                        </h2>

                        <div className="mt-5 flex justify-between">
                            <div className="text-xl font-bold"> Item </div>
                            <div className="text-xl font-bold"> Quantity </div>
                        </div>
                        {transaction.components.map((item, index) => (
                            <div key={index} className="flex justify-between">
                                <div> {item.name}</div>

                                <div> {item.quantity} </div>
                            </div>
                        ))}

                        <div className="my-5 flex justify-between">
                            <div className="font-bold"> Cost </div>
                            <div>{transaction.cost}</div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={handleDelete}
                                class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Delete
                            </button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
