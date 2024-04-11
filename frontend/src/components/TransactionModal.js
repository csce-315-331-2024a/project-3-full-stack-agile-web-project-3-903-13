import React from "react";

export default function TransactionModal({ isOpen, onClose, transaction }) {
    if (!isOpen) return null;

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
                        <h2 className="text-xl font-bold mb-4">
                            Transaction Details
                        </h2>

                        <div className="mt-5 flex justify-between">
                            <div className="font-semibold"> Item </div>
                            <div className="font-semibold"> Quantity </div>
                        </div>
                        {transaction.components.map((item, index) => (
                            <div key={index} className="flex justify-between">
                                <div> {item.name}</div>

                                <div> {item.quantity} </div>
                            </div>
                        ))}

                        <div className="mt-5 flex justify-between">
                            <div> Cost </div>
                            <div>{transaction.cost}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
