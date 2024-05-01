
"use client"

import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

/**
 * Provides a context for managing transaction data throughout the application.
 * This includes operations such as adding or updating transactions, clearing transactions,
 * submitting transactions to a server, and removing items from transactions.
 *
 * @module TransactionContext
 */
const TransactionContext = createContext();

/**
 * Custom hook to access and manipulate transaction data.
 * @function useTransaction
 * @returns {Object} The transaction context with all its values and functions.
 */
export const useTransaction = () => useContext(TransactionContext);

/**
 * Context Provider component that manages transaction data and provides utility functions
 * to manipulate this data. It handles storing transactions in local storage to persist state
 * across sessions.
 *
 * @function TransactionProvider
 * @param {Object} props - The props passed to the TransactionProvider component.
 * @param {ReactNode} props.children - The children components that will have access to the transaction context.
 * @returns {ReactNode} - A Context Provider wrapping the children with access to transaction state and functions.
 */
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransaction] = useState(() => {
    if (typeof window !== 'undefined') {
      const currentTransaction = localStorage.getItem("currentTransaction");
      return currentTransaction ? JSON.parse(currentTransaction) : [];
    }
    return [];
  });

  /**
 * Updates or adds a transaction item. If the item already exists (matched by id and modification string),
 * its quantity is incremented. Otherwise, a new item is added.
 *
 * @function updateTransaction
 * @param {Object} item - The transaction item to add or update.
 */
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

  
  /**
   * Clears all transactions from the state and local storage, effectively resetting the transaction data.
   * @function clearTransaction
   */
  const clearTransaction = () => {
    setTransaction(null)
    if (typeof window !== 'undefined'){
      localStorage.setItem("currentTransaction", [])
    }
  }

  /**
   * Submits the current transactions as a new order to a server endpoint. This function also calculates
   * the total cost, tax, and submits these along with the order contents. Upon successful submission,
   * the current transactions are cleared.
   * @function submitTransaction
   */
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

  /**
   * Removes a specific item from the transaction or decrements its quantity if more than one exists.
   * If the last item of a specific type is removed, it's completely removed from the transaction.
   *
   * @function removeItemFromTransaction
   * @param {string} itemId - The id of the item to remove.
   * @param {string} modifString - The modification string associated with the item to identify the correct variant.
   */
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

  /**
   * Completely removes an item from the transaction regardless of its quantity.
   *
   * @function removeItemCompletely
   * @param {string} itemId - The id of the item to remove.
   * @param {string} modifString - The modification string associated with the item to identify the correct variant.
   */
  const removeItemCompletely = (itemId, modifString) => {
    const updatedTransactions = transactions.filter(item => item.id !== itemId || item.modif != modifString);
    setTransaction(updatedTransactions);
  }

  /**
   * Sets the transaction to a new set of transactions. Useful for replacing the current transaction
   * with a new set of items, such as when loading a saved order.
   *
   * @function setToNewOrder
   * @param {Array} transaction - Array of new transaction items to set.
   */
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


