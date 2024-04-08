"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaWindowClose, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import GoogleTranslateWidget from "@/components/GoogleTranslate";
import { useTransaction } from "@/components/TransactionContext";


export default function CustomerNavbar({ links }) {
  const pathname = usePathname();
  const { transactions, clearTransaction, submitTransaction, updateTransaction, removeItemFromTransaction } = useTransaction();
  const [transactionsList, setTransactionsList] = useState(null);
  
  useEffect(() => {
    setTransactionsList(transactions);
  }, [transactions]);

  const toggleCart = ()=>{
      if (ref.current.classList.contains('translate-x-full')) {
        ref.current.classList.remove('translate-x-full')
        ref.current.classList.add('translate-x-0')
      }
      else if (!ref.current.classList.contains('translate-x-full')) {
        ref.current.classList.remove('translate-x-0')
        ref.current.classList.add('translate-x-full')
      }
  }
  const ref = useRef()

  return (
    <nav className="flex w-full h-[5rem] bg-white shadow-md">
      <div className="flex w-full h-full justify-between items-center px-6 font-bold [&>*>li]:relative">
        <ul className="flex flex-row gap-8 items-center">
          <li>
              <Image src={"./logo.svg"} width={24} height={24}></Image>
          </li>
          {links.map((link) => (
            <li key={link.route}>
              <Link
                className={
                  pathname === link.route ? "nav-link-active" : "nav-link"
                }
                href={link.route}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-row gap-8 items-center">
          <GoogleTranslateWidget />
          <li>
            <Link href={"/employee/burgers"}>
              <Image className="nav-image" src={"./user.svg"} width={24} height={24}></Image>
            </Link>
          </li>
          {/* <li>
            <Link href={"/cart"}>
              <Image className="nav-image" src={"./cart.svg"} width={24} height={24}></Image>
            </Link>
          </li> */}
          <div onClick={toggleCart} className="cursor-pointer cart">
              <Image className="nav-image" src={"./cart.svg"} width={24} height={24}></Image>
          </div>
        </ul>

        <div ref={ref} className="w-200 sideCart fixed top-0 right-0 bg-pink-100 px-8 py-10 transform transition-transform 
        translate-x-full z-50 overflow-y-auto max-h-screen">
          <h2 className = 'font-bold text-xl text-center'>Shopping Cart</h2>
          <span onClick = {toggleCart} className = "cursor-pointer absolute top-5 right-2 text-2xl"><FaWindowClose /></span>
          <div className="flex flex-col justify-evenly items-center">
            {transactionsList ? transactionsList.map((item, index) => (
              <div key={index} className="flex items-center justify-between w-full bg-gray-50 p-3 my-2 rounded-lg shadow">
                <span className="flex-1 mr-4 font-semibold">{item.itemname}</span>
                <div className="flex items-center justify-center flex-1">
                  <FaMinusCircle 
                    className="text-red-500 cursor-pointer" 
                    onClick={() => removeItemFromTransaction(item.id)}
                  />
                  <span className="mx-4 text-lg">x{item.quantity}</span>
                  <FaPlusCircle 
                    className="text-green-500 cursor-pointer" 
                    onClick={() => updateTransaction(item)}
                  />
                </div>
                <span className="flex-1 text-right font-semibold">${item.price}</span>
              </div>
            )) : <div className="flex flex-col items-center">No items in current transaction!</div>}
          </div>
          <div className="px-6 pt-4 pb-2 flex flex-col items-center">
            <h1>Price: {
              transactionsList ? "$" + transactionsList.reduce((total, currentItem) => total + currentItem.price * currentItem.quantity, 0).toFixed(2) : "$0.00"
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
      </div>
    </nav>
  );
}
