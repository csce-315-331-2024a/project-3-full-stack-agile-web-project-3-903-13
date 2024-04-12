import React from "react";

import { useEffect, useState, useContext } from "react";

import { TransactionContext, TransactionProvider, useTransaction } from "@/components/TransactionContext";

function TransactionPanel() {
    const { transactions, updateTransaction, clearTransaction, submitTransaction } = useTransaction();
    const [transactionsList, setTransactionsList] = useState(null);
    useEffect(() => {
        setTransactionsList(transactions)
    }, [transactions])
    return (
        // flex grow flex-col justify-between items-center
        <div className="flex flex-col grow justify-between border-2 border-black rounded overflow-hidden shadow-lg mx-5 mb-5 mt-2 p-5">
            <div className="text-2xl font-bold text-center mt-2 mb-3">Current Sale</div>

            <div className="flex flex-col justify-evenly items-center">
                {transactionsList ? transactionsList.map((item, index) => {
                    return <div key={index} className="items-center">{item.itemname} x{item.quantity} ${item.price}</div>
                }) : <div className="flex flex-col items-center">No items in current transaction!</div>}
                {/*{transactionsList ? <li>{transactionsList.length}</li> : <li>No items in current transaction!</li>}*/}
            </div>
            <div className="px-6 pt-4 pb-2 flex flex-col items-center">
                <h1>Price: {
                    transactionsList ? "$" + transactionsList.reduce((total, currentItem) => { return total + currentItem.price * currentItem.quantity }, 0).toFixed(2) : "$0.00"
                }</h1>
            </div>


            <div className="flex flex-row justify-between">
                <div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={clearTransaction}>
                        Clear Transaction
                    </button>
                </div>

                <div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={submitTransaction}>
                        Charge
                    </button>
                </div>


            </div>
        </div>
    )
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
        updateTransaction({ "id": props.item.menuid, "itemname": props.item.itemname, "price": props.item.price, "quantity": quantity })
    }

    return (
        <div className="flex justify-center px-10 py-14 items-center bg-white border border-gray rounded-lg shadow-md hover:shadow-xl transition duration-300" onClick={sendToTransaction}>
            <div className="text-xl font-semibold text-gray-900 text-center">
                {props.item.itemname}
            </div>
        </div>
    )
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
    }, []);

    return (

        <div className="flex flex-row h-[75vh]">
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

