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
      transactions.forEach((menuItem,index,transactions) => {
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
    const price = transactions.reduce((total, currentItem) => {return total + currentItem.price}, 0)
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


