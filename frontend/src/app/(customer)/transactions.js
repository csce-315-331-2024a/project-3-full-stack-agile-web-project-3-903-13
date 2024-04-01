"use client"

import React, { createContext, useState, useContext, useEffect } from 'react';

const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransaction] = useState(() => {
    if (typeof window !== 'undefined') {
      const currentTransaction = localStorage.getItem("currentTransaction");
      return currentTransaction ? JSON.parse(currentTransaction) : [];
    }
    return [];

  });

  const updateTransaction = (item) => {
    if (transactions == null) {
      setTransaction([item])
    } else {
      var itemFound = false
      transactions.forEach((menuItem, index, transactions) => {
        if (item.id == menuItem.id) {
          transactions[index].quantity = menuItem.quantity + 1
          itemFound = true
        }
      });
      if (!itemFound) {
        setTransaction([...transactions, item]);
      } else {
        localStorage.setItem("currentTransaction", JSON.stringify(transactions))
        setTransaction([...transactions])
      }
    }
  };

  const clearTransaction = () => {
    setTransaction(null)
    localStorage.setItem("currentTransaction", [])
  }

  const submitTransaction = () => {
    const price = transactions.reduce((total, currentItem) => { return total + currentItem.price }, 0)
    const taxAmount = price * 0.0825
    const orderContents = transactions
    const requestData = {
      "totalCost": price + taxAmount,
      "taxAmount": taxAmount,
      "orderContents": orderContents
    }
    fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/transactions/new", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(requestData)
    })
  }

  useEffect(() => {
    localStorage.setItem("currentTransaction", JSON.stringify(transactions))
  }, [transactions])

  return (
    <TransactionContext.Provider value={{ transactions, updateTransaction, clearTransaction, submitTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};

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

export function MenuItemList({ categoryNum, categoryName }) {
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
      <TransactionPanel />
    </div>
  );
}