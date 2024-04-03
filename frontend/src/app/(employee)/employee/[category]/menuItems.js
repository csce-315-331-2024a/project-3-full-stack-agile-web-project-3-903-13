import React from "react";

import { useEffect, useState, useContext } from "react";

import { TransactionContext, TransactionProvider, useTransaction } from "@/components/TransactionContext";

function TransactionPanel() {
    const {transactions, updateTransaction, clearTransaction, submitTransaction} = useTransaction();
    const [transactionsList, setTransactionsList] = useState(null);
    useEffect(() => {
        setTransactionsList(transactions)
    },[transactions])
    return ( 
            <div className="max-w-sm border-2 border-black rounded overflow-hidden shadow-lg mr-5 flex flex-col justify-between items-center">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Current Sale</div>
              </div>
              <div className="flex flex-col justify-evenly items-center">
                    {transactionsList ? transactionsList.map((item, index) => {
                            return <div key={index} className="items-center">{item.itemname} x{item.quantity} ${item.price}</div>
                        }) : <div className="flex flex-col items-center">No items in current transaction!</div>}
                    {/*{transactionsList ? <li>{transactionsList.length}</li> : <li>No items in current transaction!</li>}*/}
              </div>
              <div className="px-6 pt-4 pb-2 flex flex-col items-center">
                <h1>Price: {
                    transactionsList ? "$" + transactionsList.reduce((total, currentItem) => {return total + currentItem.price*currentItem.quantity}, 0).toFixed(2) : "$0.00"
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
            const response = await fetch('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/menuitems');
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

