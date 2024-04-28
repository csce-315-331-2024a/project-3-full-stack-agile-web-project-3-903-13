"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaMinusCircle, FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
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
	const [isCartOpen, setIsCartOpen] = useState(false);

	useEffect(() => {
		setTransactionsList(transactions);
		// Ensure transactions is an array before using reduce
		const totalItems = Array.isArray(transactions) ? transactions.reduce((acc, item) => acc + item.quantity, 0) : 0;
		setCartCount(totalItems);
	}, [transactions]);

	const toggleCart = () => {
		if (ref.current && ref.current.classList.contains('translate-x-full')) {
			setIsCartOpen(true)
			ref.current.classList.remove('translate-x-full')
			ref.current.classList.add('translate-x-0')
			document.body.classList.add('no-scroll');
		} else if (ref.current && !ref.current.classList.contains('translate-x-full')) {
			setIsCartOpen(false);
			ref.current.classList.add('translate-x-full')
			ref.current.classList.remove('translate-x-0')
			document.body.classList.remove('no-scroll');
		}
	}

	const getSubtotal = () => {
		return transactionsList.reduce((total, currentItem) => total + currentItem.price * currentItem.quantity, 0).toFixed(2)
	}

	const getTax = () => {
		return (getSubtotal() * 0.0825).toFixed(2)
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

	const handleOrderDisplayClick = () => {
		window.open("/orderDisplay", "_blank", "noopener,noreferrer");
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
							<Image alt="Rev logo" className="hidden absolute md:relative md:flex mr-8" src={"/revs.png"} width={110} height={110}></Image>
						</li>
						{links.map((link, index) => (
							<li key={index} className="mr-8">
								{link.name === "Menu Board" ? (
									<Link onClick={handleMenuBoardClick} href={link.route} className={pathname === link.route ? "nav-link-active" : "nav-link"}>{link.name}</Link>
								) : link.name === "Order Display" ? (
									// Using an anchor tag instead of Link because we're opening a new tab
									<a onClick={handleOrderDisplayClick} className={pathname === "/order_display" ? "nav-link-active" : "nav-link"} style={{ cursor: "pointer" }}>
										{link.name}
									</a>
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
								<Image alt="employee log in" className="nav-image" src={"./user.svg"} width={30} height={30}></Image>
							</Link>
						</li>
						<div onClick={toggleCart} className="cursor-pointer cart relative">
							<Image alt="cart" className="nav-image" src={"./cart.svg"} width={30} height={30}></Image>
							{cartCount > 0 && (
								<span className="absolute top-[-15px] right-[-15px] inline-block px-1 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
									{cartCount}
								</span>
							)}
						</div>
					</ul>

					<div onClick={toggleCart} className={`fixed z-[40] left-0 top-0 bottom-0 right-0 w-screen h-screen bg-black/40 backdrop-blur-sm ${isCartOpen ? "" : "hidden"}`}></div>

					<div ref={ref} className="min-w-[25%] h-full fixed top-0 right-0 bg-white transform transition-transform translate-x-full z-50 shadow-2xl">
						<div className="flex flex-col h-full">
							<div className="flex justify-end p-2">
								<button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">
									<svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div className="border-t-2 border-gray-300" />

							<div className="flex-grow overflow-y-auto">
								<div className="flex flex-col justify-evenly items-center">
									{transactionsList ? transactionsList.map((item, index) => (
										<div key={index} className="flex flex-col justify-between w-full bg-gray-100 p-4 my-2 rounded-lg shadow">
											<div className="flex w-full justify-between items-center">
												<span className="font-semibold flex-1 mr-2">{item.itemname} - ${(item.price * item.quantity).toFixed(2)}</span>
												<FaTimesCircle className="text-red-500 cursor-pointer flex-shrink-0" onClick={() => removeItemCompletely(item.id, item.modif)} />
											</div>
											<div className="max-w-48">
												<p className="font-normal text-sm "> {item.modif && item.modif.slice(0, item.modif.length - 1)} </p>
											</div>
											<div className="flex items-center justify-center mt-2">
												<FaMinusCircle className="text-red-500 cursor-pointer" onClick={() => removeItemFromTransaction(item.id, item.modif)} />
												<span className="mx-2 text-lg">{item.quantity}</span>
												<FaPlusCircle className="text-green-500 cursor-pointer" onClick={() => updateTransaction(item)} />
											</div>
										</div>
									)) : <div className="flex flex-col items-center">No items!</div>}
								</div>
							</div>
							<div className="border-t-2 border-gray-300" />

							<div className="px-6 py-2 flex flex-col">
								{transactionsList && (
									<div>
										<div className="flex justify-between">
											<p>Subtotal</p>
											<p>{transactionsList ? "$" + getSubtotal() : "$0.00"}</p>
										</div>

										<div className="flex justify-between">
											<p>Tax</p>
											<p>{transactionsList ? "$" + getTax() : "$0.00"}</p>
										</div>

										<div className="flex justify-between">
											<p>Total</p>
											<p>
												{transactionsList
													? "$" + (parseFloat(getSubtotal()) + parseFloat(getTax())).toFixed(2)
													: "$0.00"}
											</p>
										</div>
									</div>
								)}
							</div>
							<div className="flex mt-auto">
								<button
									className="text-white w-1/2 bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 shadow-sm px-4 py-4"
									onClick={clearTransaction}
								>
									Clear
								</button>
								<button
									className="text-white w-1/2 bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 shadow-sm px-4 py-4"
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
									Checkout
								</button>
							</div>
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

				<ToastContainer limit={1} />
			</nav>
		</>
	);
}
