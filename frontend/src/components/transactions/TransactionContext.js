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
        if (item.id == menuItem.id && item.modif == menuItem.modif) {
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
    if (typeof window !== 'undefined'){
      localStorage.setItem("currentTransaction", [])
    }
  }

  const submitTransaction = () => {
    const price = transactions.reduce((total, currentItem) => {return total + currentItem.price * currentItem.quantity}, 0)
    const taxAmount = price * 0.0825
    const orderContents = transactions
    const requestData = {
      "totalCost": price + taxAmount,
      "taxAmount": taxAmount,
      "orderContents": orderContents
    }
    fetch("http://localhost:5000/api/transactions/new", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(requestData)
    })
    clearTransaction();
  }

  const removeItemFromTransaction = (itemId, modifString) => {
    const updatedTransactions = transactions.reduce((acc, item) => {
      if (item.id === itemId && item.modif == modifString) {
        if (item.quantity > 1) {
          acc.push({ ...item, quantity: item.quantity - 1 });
        }
      } else {
        acc.push(item);
      }
      return acc;
    }, []);

    setTransaction(updatedTransactions);
  };

  const removeItemCompletely = (itemId, modifString) => {
    const updatedTransactions = transactions.filter(item => item.id !== itemId || item.modif != modifString);
    setTransaction(updatedTransactions);
  }

  const setToNewOrder = (transaction) => {
    setTransaction([...transaction]);
  }

  useEffect(() => {
    localStorage.setItem("currentTransaction", JSON.stringify(transactions))
  }, [transactions])

  return (
    <TransactionContext.Provider value={{ transactions, updateTransaction, clearTransaction, submitTransaction, removeItemFromTransaction, removeItemCompletely, setToNewOrder }}>
      {children}
    </TransactionContext.Provider>
  );

  
};


