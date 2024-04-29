"use client"

import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

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
    setTransaction(prevTransactions => {
      if (!prevTransactions || prevTransactions.length === 0) {
        return [item];
      } else {
        let itemFound = false;
        const updatedTransactions = prevTransactions.map(transaction => {
          if (transaction.id === item.id && transaction.modif === item.modif) {
            itemFound = true;
            return { ...transaction, quantity: transaction.quantity + 1 };
          }
          return transaction;
        });
  
        if (!itemFound) {
          updatedTransactions.push(item);
        }
  
        localStorage.setItem("currentTransaction", JSON.stringify(updatedTransactions));
        return updatedTransactions;
      }
    });
  };

  
  const clearTransaction = () => {
    setTransaction(null)
    if (typeof window !== 'undefined'){
      localStorage.setItem("currentTransaction", [])
    }
  }

  const submitTransaction = () => {
    const price = parseFloat(transactions.reduce((total, currentItem) => {return total + currentItem.price * currentItem.quantity}, 0).toFixed(2))
    const taxAmount = parseFloat((price * 0.0825).toFixed(2))
    const total = parseFloat((price + taxAmount).toFixed(2))
    const orderContents = transactions
    const requestData = {
      "totalCost": total,
      "taxAmount": taxAmount,
      "orderContents": orderContents
    }
    fetch("https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/transactions/new", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(requestData)
    }).then(() => {
      clearTransaction();
      toast.success("The transaction was a success!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }).catch(error => {
      console.error('Error submitting transaction:', error);
    });
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
    <TransactionContext.Provider 
      value={{ transactions, updateTransaction, clearTransaction, submitTransaction, removeItemFromTransaction, 
               removeItemCompletely, setToNewOrder}}>
      {children}
    </TransactionContext.Provider>
  );

  
};


