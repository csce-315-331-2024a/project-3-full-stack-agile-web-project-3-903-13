"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaWindowClose, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import GoogleTranslateWidget from "@/components/GoogleTranslate";
import WeatherWidget from "@/components/WeatherAPI";
import { useTransaction } from "@/components/transactions/TransactionContext";
import PaymentModal from "@/components/transactions/PaymentModal"



export default function CustomerNavbar({ links }) {
  const pathname = usePathname();
  const {
    transactions,
    clearTransaction,
    submitTransaction,
    updateTransaction,
    removeItemFromTransaction,
    removeItemCompletely,
  } = useTransaction();
  const [transactionsList, setTransactionsList] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setTransactionsList(transactions);
    // Ensure transactions is an array before using reduce
    const totalItems = Array.isArray(transactions) ? transactions.reduce((acc, item) => acc + item.quantity, 0) : 0;
    setCartCount(totalItems);
  }, [transactions]);

  const toggleCart = () => {
    if (ref.current && ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.remove('translate-x-full')
      ref.current.classList.add('translate-x-0')
    } else if (ref.current && !ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.add('translate-x-full')
      ref.current.classList.remove('translate-x-0')
    }
  }

  const handlePayment = () => {
    submitTransaction();
    setShowPaymentOptions(false);
  };

  const ref = useRef()

  return (
    <nav className="flex w-full h-[5rem] bg-white shadow-md">
      <div className="flex w-full h-full justify-between items-center px-6 font-bold [&>*>li]:relative">
        <ul className="flex flex-row items-center">
          <li>
            <img className="hidden absolute md:relative md:flex mr-8" src={"./revs.png"} width={110} height={110}></img>
          </li>
          {links.map((link) => (
            <li key={link.route} className="mr-8">
              <Link className={pathname === link.route ? "nav-link-active" : "nav-link"} href={link.route}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-row gap-8 items-center">
          <li>
            <Link href={"/employee/burgers"}>
              <Image className="nav-image" src={"./user.svg"} width={30} height={30}></Image>
            </Link>
          </li>
          <div onClick={toggleCart} className="cursor-pointer cart relative">
            <Image className="nav-image" src={"./cart.svg"} width={30} height={30}></Image>
            {cartCount > 0 && (
              <span className="absolute top-[-15px] right-[-15px] inline-block px-1 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </ul>

        <div ref={ref} className="w-200 sideCart fixed top-0 right-0 bg-pink-100 px-8 py-10 transform transition-transform translate-x-full z-50 overflow-y-auto max-h-screen">
          <h2 className='font-bold text-xl text-center'>Shopping Cart</h2>
          <span onClick={toggleCart} className="cursor-pointer absolute top-5 right-2 text-2xl"><FaWindowClose /></span>
          <div className="flex flex-col justify-evenly items-center">
            {transactionsList ? transactionsList.map((item, index) => (
              <div key={index} className="flex items-center justify-between w-full bg-gray-50 p-4 my-2 rounded-lg shadow space-x-4">
                <span className="flex-1 font-semibold truncate pr-2">{item.itemname}</span>
                <div className="flex items-center flex-none">
                  <FaMinusCircle className="text-red-500 cursor-pointer" onClick={() => removeItemFromTransaction(item.id)} />
                  <span className="mx-2 text-lg">x{item.quantity}</span>
                  <FaPlusCircle className="text-green-500 cursor-pointer" onClick={() => updateTransaction(item)} />
                </div>
                <span className="flex-none font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                <FaWindowClose
                  className="ml-2 text-xl text-red-600 cursor-pointer flex-none"
                  onClick={() => removeItemCompletely(item.id)}
                />
              </div>
            )) : <div className="flex flex-col items-center">No items in current transaction!</div>}
          </div>
          <div className="px-6 pt-4 pb-2 flex flex-col items-center">
            <h1>Total Price: {
              transactionsList ? "$" + transactionsList.reduce((total, currentItem) => total + currentItem.price * currentItem.quantity, 0).toFixed(2) : "$0.00"
            }</h1>
          </div>
          <div className="px-6 pt-4 pb-2 flex flex-col items-center">
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={clearTransaction}>
              Clear Transaction
            </button>
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={() => setShowPaymentOptions(true)}>
              Charge
            </button>
          </div>
        </div>
      </div>

      {/* Payment options modal */}
      {showPaymentOptions && (
        <PaymentModal
          showPaymentOptions={showPaymentOptions}
          setShowPaymentOptions={setShowPaymentOptions}
          handlePayment={handlePayment}
        />
      )}
                  <GoogleTranslateWidget />

    </nav>
  );
}

