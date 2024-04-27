import React, { useEffect, useState } from "react";
// import Link from 'next/link'
import Image from 'next/image'
import { useTransaction } from "@/components/transactions/TransactionContext";
import { toast } from 'react-toastify';


export default function UpdateModal({ isOpen, onClose, item }) {
    const [deleteMessage, setDeleteMessage] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");

    const [ingredients, setIngredients] = useState()
    const [removedIngredients, setRemovedIngredients] = useState([]);

    const { updateTransaction, transactions } = useTransaction();

    const sendToTransaction = (dish, modificationString) => {
        var quantity = 0;
        if (transactions) {
            transactions.forEach(item => {
                if (dish.menuid === item.id && dish.modif === item.modif) {
                    quantity = item.quantity + 1;
                }
            });
        }
        if (quantity === 0) {
            quantity = 1;
        }
        updateTransaction({ "id": dish.menuid, "itemname": dish.itemname, "price": dish.price, "quantity": quantity, "modif": modificationString });
        toast.success(`${dish.itemname} added to cart!`, {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    };

    useEffect(() => {
        setRemovedIngredients([])
        const getMenuItemIngredients = async () => {
            try {

                const name = item.itemname
                const params = name.split(' ').join("+")

                const response = await fetch(`http://localhost:5000/api/menuitems/getIngreds?itemName=${params}`);

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

                const data = await response.json();

                const itemsFilterOut = ["Utensils", "To Go Boxes", "Bags", "Napkins"];
                const isItemFilterOut = (item) => itemsFilterOut.includes(item)

                const filteredData = data.filter(item => !isItemFilterOut(item.ingredientname));

                setIngredients(filteredData)
                setRemovedIngredients(new Array(filteredData.length).fill(false))

            } catch (error) {
                console.error("Error fetching ingredient for menu item:", error);
                throw error;
            }
        };

        if (isOpen) {
            getMenuItemIngredients()
        }

    }, [item]);

    


    const handleIngredientClick = (index) => {
        setRemovedIngredients(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });

    };

    const handleAddCart = () => {
        let temp = "";
        for (let i = 0; i < removedIngredients.length; i++) {
            if (removedIngredients[i]) {
                temp += "No " + ingredients[i].ingredientname.toString() + ",";
            }
        }
        sendToTransaction(item, temp)
    }


    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative">
                <div className="max-w-3xl bg-white p-12 pb-4 rounded-lg shadow-lg">
                    <button
                        className="absolute top-3 right-4 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    <div className="flex flex-col">
                        <div className="flex flex-row">

                            <div className="mr-8 w-[50%]">
                                <Image
                                    src={`/menuItems/${item.itemname.replace(/\s+/g, '')}.jpeg`}
                                    alt={item.itemname}
                                    className="object-cover rounded-lg"
                                    width={300}
                                    height={350}
                                    priority={true}
                                />
                            </div>

                            <div className="flex flex-col min-w-[50%] max-w-[60%]">
                                <div className="mb-8">
                                    <h3 className="font-semibold text-3xl">
                                        {item.itemname}
                                    </h3>
                                    <hr className="border-[3px] border-black my-2" />
                                    <h5 className="text-md"> {item.description}</h5>
                                </div>


                                <span className="ml-1 font-semibold text-xl">
                                    Customize
                                    <hr className="border-[3px] border-black mb-1 w-28" />

                                </span>
                                <div>
                                    {ingredients && ingredients.map((item, index) => (
                                        <button
                                            key={index}
                                            className={`rounded-md px-3 py-1 m-1 transition duration-100 ease-in-out 
                                                        ${removedIngredients[index] ? 'line-through' : 'bg-gray-300 hover:bg-gray-400'}`}
                                            onClick={() => { handleIngredientClick(index) }}
                                        >
                                            {item.ingredientname}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>


                        <div className="mt-5 flex flex-row-reverse">
                            <button
                                className="bg-red-800 font-semibold text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 hover:text-black 
                                        transition duration-200 ease-in-out"
                                onClick={() => handleAddCart()}
                            >
                                Add to Bag
                            </button>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}
