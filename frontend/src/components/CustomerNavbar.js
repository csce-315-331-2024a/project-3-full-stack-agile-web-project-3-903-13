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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



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

  const ref = useRef();

  
  const handleMenuBoardClick = () => {
    window.open("/menu_board/Board_1/", "_blank", "noopener,noreferrer");
    setTimeout(() => {
      window.open("/menu_board/Board_2", "_blank", "noopener,noreferrer");
    }, 100);
    setTimeout(() => {
      window.open("/menu_board/Board_3", "_blank", "noopener,noreferrer");
    }, 200);
  };

  return (
    <>
    <style jsx>{`
      .bg-light-maroon {
        background-color: #b03060;
      }
      .text-dark-maroon {
        color: #800000;
      }
    `}</style>
    <nav className="flex w-full h-[5rem] bg-white shadow-md">
      <div className="flex w-full h-full justify-between items-center px-6 font-bold [&>*>li]:relative">
        <ul className="flex flex-row items-center">
          <li>
            <Image alt = "Rev logo" className="hidden absolute md:relative md:flex mr-8" src={"/revs.png"} width={110} height={110}></Image>
          </li>
          {links.map((link) => (
            <li key={link.route} className="mr-8">
            {link.name === "Menu Board" ? (
              // TODO: make this less complicated
              <Link onClick={handleMenuBoardClick} href={link.route} className={pathname === link.route ? "nav-link-active" : "nav-link"}>{link.name}</Link>
            ) : link.links ? (
              <div className="relative">
                {link.name}
              </div>
              ) : (
                <Link className={pathname === link.route ? "nav-link-active" : "nav-link"} href={link.route}>
                  {link.name}
                </Link>
              )}
            </li>
          ))}
 
        </ul>
        <ul className="flex flex-row gap-8 items-center">
          <li>
            <Link href={"/employee/burgers"}>
              <Image alt = "employee log in" className="nav-image" src={"./user.svg"} width={30} height={30}></Image>
            </Link>
          </li>
          <div onClick={toggleCart} className="cursor-pointer cart relative">
            <Image alt = "cart" className="nav-image" src={"./cart.svg"} width={30} height={30}></Image>
            {cartCount > 0 && (
              <span className="absolute top-[-15px] right-[-15px] inline-block px-1 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </ul>

        <div ref={ref} className="w-200 sideCart fixed top-0 right-0 bg-pink-100 px-8 py-10 transform transition-transform translate-x-full z-50 overflow-y-auto max-h-screen">
          <span onClick={toggleCart} className="cursor-pointer absolute top-5 left-2 text-lg text-dark-maroon hover:text-blue-800">&lt; Return to Menu</span>
          <hr className="my-2 border-t-2 border-gray-300" />
          <div className="flex flex-col justify-evenly items-center">
            {transactionsList ? transactionsList.map((item, index) => (
              <div key={index} className="flex flex-col items-center justify-between w-full bg-gray-50 p-4 my-2 rounded-lg shadow">
                <div className="flex w-full justify-between items-center">
                  <span className="font-semibold flex-1 mr-2">{item.itemname} - ${(item.price * item.quantity).toFixed(2)}</span>
                  <FaWindowClose className="text-red-600 cursor-pointer flex-shrink-0" onClick={() => removeItemCompletely(item.id, item.modif)} />
                </div>
                <div className="flex items-center justify-center mt-2">
                  <FaMinusCircle className="text-red-500 cursor-pointer" onClick={() => removeItemFromTransaction(item.id, item.modif)} />
                  <span className="mx-2 text-lg">x{item.quantity}</span>
                  <FaPlusCircle className="text-green-500 cursor-pointer" onClick={() => updateTransaction(item)} />
                </div>
                <hr className="w-full border-t my-2" />
              </div>
            )) : <div className="flex flex-col items-center">No items in current transaction!</div>}
          </div>
          <hr className="border-t-2 border-gray-300" /> 
          <div className="px-6 pt-4 pb-2 flex flex-col items-center">
            <h1>Total Price: {
              transactionsList ? "$" + transactionsList.reduce((total, currentItem) => total + currentItem.price * currentItem.quantity, 0).toFixed(2) : "$0.00"
            }</h1>
          </div>
          <div className="flex justify-between mt-4">
            <button
              className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
              onClick={clearTransaction}
            >
              Clear Transaction
            </button>
            <button
              className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 rounded-md shadow-sm px-4 py-2"
              onClick={() => {
                if (cartCount > 0) {
                  setShowPaymentOptions(true);
                } else {
                  toast.error('Your cart is empty. Add items before charging.', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }
              }}
            >
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
          enableCreditCardInput={true}
        />
      )}
                  <GoogleTranslateWidget />
                  <ToastContainer limit ={1}/>
    </nav>
    </>
  );
}
