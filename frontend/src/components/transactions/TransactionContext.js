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
    // setInventoryModif([])
    if (typeof window !== 'undefined'){
      localStorage.setItem("currentTransaction", [])
      // localStorage.setItem("inventoryModif", [])
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
    fetch("http://localhost:5000/api/transactions/new", {
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


  // Array to hold value of ingredients which we have to adjust later
  // const [inventoryModif, setInventoryModif] = useState(() => {
  //   if (typeof window !== 'undefined') {
  //     const inventoryModif = localStorage.getItem("inventoryModif");
  //     return inventoryModif ? JSON.parse(inventoryModif) : [];
  //   }
  //   return [];
  // });

  // const addToModif = (inventoryItem) => {
  //   setInventoryModif(prevInventoryModif => {
  //     if (!prevInventoryModif || prevInventoryModif.length === 0) {
  //       return [inventoryItem];
  //     } else {
  //       const updatedInventoryModif = prevInventoryModif.map(item => ({ ...item }));
  //       let found = false;
  //       for (let i = 0; i < updatedInventoryModif.length; i++) {
  //         if (updatedInventoryModif[i].inventid === inventoryItem.inventid) {
  //           updatedInventoryModif[i].quantity += inventoryItem.quantity;
  //           found = true;
  //           break;
  //         }
  //       }
  //       if (!found) {
  //         updatedInventoryModif.push(inventoryItem);
  //       }
  //       return updatedInventoryModif;
  //     }
  //   });
  // };

  // const removeFromModif = (menuItem) => {
  //   const ingreds = menuItem.modif.split(',')
  //   console.log(ingreds)
  // }
  

  // useEffect(() => {
  //   localStorage.setItem("inventoryModif", JSON.stringify(inventoryModif))
  // }, [inventoryModif])

  return (
    <TransactionContext.Provider 
      value={{ transactions, updateTransaction, clearTransaction, submitTransaction, removeItemFromTransaction, 
               removeItemCompletely, setToNewOrder}}>
      {children}
    </TransactionContext.Provider>
  );

  
};


