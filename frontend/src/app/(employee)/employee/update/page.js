"use client";

import { useEffect, useState } from "react";
import NumericKeypad from "@/components/transactions/NumericKeypad";
import PaymentModal from "@/components/transactions/PaymentModal";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function UpdateOrder({components, setComponents, shallowCopy, setShallowCopy,}) {
	const searchParams = useSearchParams();
	const id = searchParams.get("id");

	/*
		  Defining functions for components that contains the list of all the items;
	  */
	const removeItemCompletely = (itemId) => {
		const updatedTransactions = components.filter((item) => item.id !== itemId);
		setComponents([...updatedTransactions]);
	};

	const updateTransaction = (item) => {
		if (components == null) {
			setComponents([item]);
		} else {
			var itemFound = false;
			components.forEach((menuItem, index) => {
				if (item.id == menuItem.id) {
					components[index].quantity = menuItem.quantity + 1;
					itemFound = true;
				}
			});
			if (!itemFound) {
				setComponents([...components, item]);
			}
		}
	};

	// console.log(shallowCopy)

	const [showPaymentOptions, setShowPaymentOptions] = useState(false);
	const [keypadVisible, setKeypadVisible] = useState(false);

	const [currentItemId, setCurrentItemId] = useState(null);
	const [inputValue, setInputValue] = useState("");

	const [message, setMessage] = useState("");

	const updatePlacedOrder = async () => {
		const response = await fetch(
			"http://localhost:5000/api/transactions/updateTransaction",
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					transactionID: id,
					oldcomponents: shallowCopy,
					newComponents: components,
				}),
			}
		);
		setComponents();
		setShallowCopy();
	};

	const handleRefund = () => {
		updatePlacedOrder();
		setMessage("Order has been updated. Refund has been issued");
	};

	const handlePayment = () => {
		updatePlacedOrder();
		setMessage("Order has been updated");
		setShowPaymentOptions(false);
	};

	const openKeypad = (itemId, currentQuantity) => {
		setCurrentItemId(itemId);
		setInputValue(String(currentQuantity));
		setKeypadVisible(true);
	};

	const onKeypadClose = () => {
		setKeypadVisible(false);
	};

	const handleQuantityChange = (itemId, newQuantity) => {
		const updatedItem = components.find((item) => item.id === itemId);
		if (updatedItem) {
			updatedItem.quantity = newQuantity;
			updateTransaction(updatedItem);
		}
	};

	const onQuantityUpdate = (newQuantity) => {
		if (newQuantity === -1) {
			removeItemCompletely(currentItemId);
		} else {
			handleQuantityChange(currentItemId, newQuantity);
		}
		onKeypadClose();
	};

	const getCharge = () => {
		return (
			components.reduce(
				(total, item) => total + item.price * item.quantity,
				0
			) -
			shallowCopy.reduce((total, item) => total + item.price * item.quantity, 0)
		);
	};

	return (
		<div className="flex flex-col grow border-2 border-gray-400 rounded-lg shadow-lg mr-5">
			<div className="px-6 py-4 border-b">
				<div className="font-bold text-xl mb-2">Current Sale</div>
			</div>
			<div className="flex-1 overflow-auto">
				{components && components.length > 0 ? (
					components.map((item, index) => (
						<div
							key={index}
							className="flex flex-col bg-white p-3 my-2 mx-4 rounded-lg shadow"
						>
							<div className="flex justify-between items-center">
								<span className="font-semibold truncate">{item.itemname}</span>
								<span className="font-semibold">
									${(item.price * item.quantity).toFixed(2)}
								</span>
							</div>
							<div className="flex items-center justify-between">
								<button
									onClick={() => openKeypad(item.id, item.quantity)}
									className="py-2 text-blue-500 hover:text-blue-700"
								>
									Quantity: {item.quantity}
								</button>
								<button
									onClick={() => removeItemCompletely(item.id)}
									className="text-red-500 hover:text-red-700"
								>
									Remove Item
								</button>
							</div>
						</div>
					))
				) : (
					<div className="px-6 py-4 text-center">
						No items in current transaction!
					</div>
				)}
			</div>

			<div className="px-6 py-4">
				{components === null ? (
					<div className="font-semibold text-lg"> Total Price: $0.00</div>
				) : getCharge() >= 0 ? (
					<div className="font-semibold text-lg">
						Price to pay: ${getCharge().toFixed(2)}
					</div>
				) : (
					<div className="font-semibold text-lg">
						Refund: ${(-1 * getCharge()).toFixed(2)}
					</div>
				)}
			</div>

			<div className="px-6 py-4 flex flex-col space-y-2">
				{getCharge() > 0 && (
					<button
						className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow"
						onClick={() => setShowPaymentOptions(true)}
					>
						Pay
					</button>
				)}
				{getCharge() < 0 && (
					<button
						className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow"
						onClick={handleRefund}
					>
						Update and refund
					</button>
				)}

				{message.length > 0 && (
					<div className="text-lg font-semibold text-green-500">
						{" "}
						{message}{" "}
					</div>
				)}
			</div>

			{/* Payment options modal */}
			{showPaymentOptions && (
				<PaymentModal
					showPaymentOptions={showPaymentOptions}
					setShowPaymentOptions={setShowPaymentOptions}
					handlePayment={handlePayment}
				/>
			)}

			{keypadVisible && (
				<NumericKeypad
					inputValue={inputValue}
					setInputValue={setInputValue}
					onValueChange={onQuantityUpdate}
					onClose={onKeypadClose}
				/>
			)}
		</div>
	);
}

function MenuItem(props) {
	const { item, components, setComponents } = props;
	const updateTransaction = (item) => {
		if (components == null) {
			setComponents([item]);
		} else {
			var itemFound = false;
			components.forEach((menuItem, index) => {
				if (item.id == menuItem.id) {
					components[index].quantity = menuItem.quantity + 1;
					itemFound = true;
				}
			});
			if (!itemFound) {
				setComponents([...components, item]);
			}
		}
	};

	const [isClicked, setIsClicked] = useState(false);

	const sendToTransaction = () => {
		var quantity = 0;
		if (components) {
			components.forEach((element) => {
				if (props.item.menuid == element.id) {
					quantity = item.quantity + 1;
				}
			});
		}
		if (quantity == 0) {
			quantity += 1;
		}
		updateTransaction({
			id: item.menuid,
			itemname: item.itemname,
			price: item.price,
			quantity: quantity,
		});
		setIsClicked(true);
		setTimeout(() => setIsClicked(false), 600);
	};

	const clickEffect = isClicked ? "border-animate" : "";

	return (
		<>
			<style>
				{`
                    @keyframes border-animation {
                        0% {
                            border-color: transparent;
                        }
                        25% {
                            border-color: black;
                        }
                        100% {
                            border-color: transparent;
                        }
                    }
                    .border-animate {
                        animation: border-animation 0.6s ease-out;
                    }
                    .menu-item {
                        transition: transform 0.15s ease-in-out;
                    }
                    .menu-item:hover {
                        transform: scale(0.95);
                    }
                `}
			</style>
			<div
				className={`menu-item flex justify-center px-3 py-4 items-center bg-white border-2 border-gray rounded-lg shadow-md hover:shadow-xl ${clickEffect}`}
				onClick={sendToTransaction}
			>
				<div className="text-xl font-semibold text-gray-900 text-center">
					{props.item.itemname}
				</div>
			</div>
		</>
	);
}

export default function EmployeePOSPage() {
	const [menuItems, setMenuItems] = useState([]);

	const [orderDetails, setOrderDetails] = useState(null);

	const [shallowCopy, setShallowCopy] = useState([]);
	const [components, setComponents] = useState([]);
	const [totalSum, setTotalSum] = useState(0);

	const [errorMessage, setErrorMessage] = useState("");

	const searchParams = useSearchParams();
	const id = searchParams.get("id");

	useEffect(() => {
		const fetchMenuItems = async () => {
			const response = await fetch(
				"http://localhost:5000/api/menuitems"
			);
			const data = await response.json();
			setMenuItems(data);
		};

		fetchMenuItems();
	});

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/api/transactions/getTransactionByID",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ transactionID: id }),
					}
				);

				if (!response.ok) {
					const errorMessage = await response.text();
					throw new Error(errorMessage);
				}

				const data = await response.json();
				setOrderDetails(data);
				setComponents([...data.components]);
				setShallowCopy(data.components.map((obj) => ({ ...obj })));
			} catch (error) {
				setErrorMessage(error.message);
			}
		};

		fetchOrder();
	}, [id]);

	if (errorMessage && errorMessage.length > 0) {
		return (
			<div className="text-2xl text-red-500 font-bold my-6 text-center">
				{" "}
				{errorMessage}{" "}
			</div>
		);
	}

	if (orderDetails && orderDetails.status != "in progress") {
		return (
			<div className="text-2xl text-red-500 font-bold my-6 text-center">
				{" "}
				Can&apos;t update already placed orders
			</div>
		);
	}

	return (
		<main className="min-h-screen bg-cream py-1">
			<div className="flex flex-row h-[90vh]">
				<div className="container max-w-[66%] p-5">
					<h1 className="text-3xl font-bold text-center mb-8"> Menu Items </h1>
					<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{menuItems.map((item, index) => (
							<MenuItem
								key={index}
								item={item}
								components={components}
								setComponents={setComponents}
							/>
						))}
					</div>
				</div>
				
				<UpdateOrder
					components={components}
					setComponents={setComponents}
					shallowCopy={shallowCopy}
					setShallowCopy={setShallowCopy}
				/>
			</div>
		</main>
	);
}
