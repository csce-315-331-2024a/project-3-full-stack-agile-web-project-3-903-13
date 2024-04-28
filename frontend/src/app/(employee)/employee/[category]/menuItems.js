import React from "react";

import { useEffect, useState, useContext } from "react";

import { TransactionContext, TransactionProvider, useTransaction } from "@/components/transactions/TransactionContext";
import NumericKeypad from "@/components/transactions/NumericKeypad"
import PaymentModal from "@/components/transactions/PaymentModal"
import UpdateModal from "@/components/updateItems/employeeView";



function TransactionPanel() {
    const { transactions, updateTransaction, removeItemCompletely, submitTransaction, clearTransaction } = useTransaction();
    const [transactionsList, setTransactionsList] = useState(null);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [keypadVisible, setKeypadVisible] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        setTransactionsList(transactions);
    }, [transactions]);

    const handlePayment = () => {
        submitTransaction();
        setShowPaymentOptions(false);
    };

    const getSubtotal = () => {
        return transactionsList.reduce((total, currentItem) => total + currentItem.price * currentItem.quantity, 0).toFixed(2)
    }

    const getTax = () => {
        return (getSubtotal() * 0.0825).toFixed(2)
    }

    const handleQuantityChange = (itemId, newQuantity) => {
        const updatedItem = transactions.find(item => item.id === itemId);
        if (updatedItem) {
            updatedItem.quantity = newQuantity;
            updateTransaction(updatedItem);
        }
    };

    const openKeypad = (itemId, currentQuantity) => {
        setCurrentItemId(itemId);
        setInputValue(String(currentQuantity));
        setKeypadVisible(true);
    };

    const onKeypadClose = () => {
        setKeypadVisible(false);
    };

    const onQuantityUpdate = (newQuantity) => {
        if (newQuantity === -1) {
            removeItemCompletely(currentItemId);
        } else {
            handleQuantityChange(currentItemId, newQuantity);
        }
        onKeypadClose();
    };

    return (
        <div className="flex flex-col grow border-2 border-gray-400 rounded-lg shadow-lg mr-5">
            <div className="px-6 py-4 border-b">
                <div className="font-bold text-xl">Current Sale</div>
            </div>
            <div className="flex-1 overflow-auto">
                {transactionsList && transactionsList.length > 0 ? (
                    transactionsList.map((item, index) => (
                        <div key={index} className="flex flex-col bg-white p-3 my-2 mx-4 rounded-lg shadow">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold truncate">{item.itemname}</span>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <div className="max-w-64 text-[13px]"> {item.modif && item.modif.slice(0, item.modif.length - 1)} </div>

                            <div className="flex items-center justify-between mt-4">
                                <button
                                    onClick={() => openKeypad(item.id, item.quantity)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded inline-flex items-center"
                                >
                                    <span>Quantity: {item.quantity}</span>
                                </button>
                                <button onClick={() => removeItemCompletely(item.id, item.modif)} className="text-red-500 hover:text-red-700">
                                    Remove Item
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="px-6 py-4 text-center">No items in current transaction!</div>
                )}
            </div>


            {transactionsList && (
                <div className="px-6 py-4 font-semibold text-lg">
                    <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p>{transactionsList ? "$" + getSubtotal() : "$0.00"}</p>
                    </div>

                    <div className="flex justify-between">
                        <p>Tax</p>
                        <p>{transactionsList ? "$" + getTax() : "$0.00"}</p>
                    </div>

                    <div className="flex justify-between">
                        <p>Total</p>
                        <p>
                            {transactionsList
                                ? "$" + (parseFloat(getSubtotal()) + parseFloat(getTax())).toFixed(2)
                                : "$0.00"}
                        </p>
                    </div>
                </div>
            )}
            <div className="px-6 py-4 flex flex-col space-y-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow" onClick={clearTransaction}>
                    Clear Transaction
                </button>
                <button
                    className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow ${!transactionsList || transactionsList.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setShowPaymentOptions(true)}
                    disabled={!transactionsList || transactionsList.length === 0}
                >
                    Charge
                </button>
            </div>

            {/* Payment options modal */}
            {showPaymentOptions && (
                <PaymentModal
                    showPaymentOptions={showPaymentOptions}
                    setShowPaymentOptions={setShowPaymentOptions}
                    handlePayment={handlePayment}
                />
            )}

            {keypadVisible && (
                <NumericKeypad
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    onValueChange={onQuantityUpdate}
                    onClose={onKeypadClose}
                />
            )}
        </div>
    );
}



function MenuItem(props) {
    const { updateTransaction, transactions } = useTransaction();
    const [isClicked, setIsClicked] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // const sendToTransaction = () => {
    //     var quantity = 0
    //     if (transactions) {
    //         transactions.forEach(item => {
    //             if (props.item.menuid == item.id) {
    //                 quantity = item.quantity + 1
    //             }
    //         });
    //     }
    //     if (quantity == 0) {
    //         quantity += 1
    //     }
    //     updateTransaction({ "id": props.item.menuid, "itemname": props.item.itemname, "price": props.item.price, "quantity": quantity });
    //     setIsClicked(true);
    //     setTimeout(() => setIsClicked(false), 600);
    // }

    const handleItemClick = (item) => {
        console.log(item)
        setSelectedItem(item)
        setIsModalOpen(true)
    }

    const closeUpdateModal = () => {
        setIsModalOpen(false);
    }

    const clickEffect = isClicked ? 'border-animate' : '';

    return (
        <>
            <style>
                {`
                    @keyframes border-animation {
                        0% {
                            border-color: transparent;
                        }
                        25% {
                            border-color: black;
                        }
                        100% {
                            border-color: transparent;
                        }
                    }
                    .border-animate {
                        animation: border-animation 0.6s ease-out;
                    }
                    .menu-item {
                        transition: transform 0.15s ease-in-out;
                    }
                    .menu-item:hover {
                        transform: scale(0.95);
                    }
                `}
            </style>
            <div
                className={`menu-item flex relative justify-center px-10 py-14 items-center bg-white border-2 border-gray rounded-lg shadow-md hover:shadow-xl ${clickEffect}`}
                onClick={() => handleItemClick(props.item)}
            >
                <div className="text-xl font-semibold text-gray-900 text-center">
                    {props.item.itemname}
                </div>
                
            </div>

            <UpdateModal
                isOpen={isModalOpen}
                onClose={closeUpdateModal}
                item={selectedItem}
            />
        </>
    );
}
export function MenuItemList({ categoryNum, categoryName }) {
    const [itemType, setItemType] = useState([]);

    useEffect(() => {
        const fetchMenuItems = async () => {
            const response = await fetch('http://localhost:5000/api/menuitems');
            const data = await response.json();
            const items = data.filter(item => item.category === parseInt(categoryNum))
            setItemType(items);
        };

        fetchMenuItems();
    }, [categoryNum]);

    return (

        <div className="flex flex-row h-[90vh]">
            <div className="container max-w-[66%] p-5">
                <h1 className="text-3xl font-bold text-center mb-8">{categoryName}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {itemType.map((item, index) => (
                        <MenuItem key={index}
                            item={item}
                        />
                    ))}
                </div>
            </div>

            <TransactionPanel />

        </div>
    );
}

