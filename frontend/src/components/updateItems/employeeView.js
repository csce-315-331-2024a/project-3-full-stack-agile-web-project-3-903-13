import React, { useEffect, useState } from "react";
// import Link from 'next/link'
import Image from 'next/image'
import { useTransaction } from "@/components/transactions/TransactionContext";
import { toast } from 'react-toastify';


export default function UpdateModal({ isOpen, onClose, item }) {
    const [deleteMessage, setDeleteMessage] = useState("");
    const [updateMessage, setUpdateMessage] = useState("");

    // Other ingredients contains non-removable ingredients like bags, utensils, etc.
    // removable ingredients contains those that CAN be removed
    // ingredientsRemoved is mainly a boolean array to track which ingredients have been removed by the User
    const [otherIngredients, setOtherIngredients] = useState()
    const [removableIngredients, setRemovableIngredients] = useState()
    const [ingredientsRemoved, setIngredientsRemoved] = useState([]);


    const { updateTransaction, transactions } = useTransaction();

    const sendToTransaction = (dish, modificationString, inventToRemove) => {
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
        updateTransaction({
            "id": dish.menuid, "itemname": dish.itemname, "price": dish.price,
            "quantity": quantity, "modif": modificationString, "inventToRemove": inventToRemove
        });
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
        setIngredientsRemoved([])
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

                setOtherIngredients(data.filter(item => isItemFilterOut(item.ingredientname)))

                const filteredData = data.filter(item => !isItemFilterOut(item.ingredientname));

                setRemovableIngredients(filteredData)
                setIngredientsRemoved(new Array(filteredData.length).fill(false))

            } catch (error) {
                console.error("Error fetching ingredient for menu item:", error);
                throw error;
            }
        };

        if (isOpen) {
            getMenuItemIngredients()
        }

    }, [item, isOpen]);




    const handleIngredientClick = (index) => {
        setIngredientsRemoved(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });

    };

    const handleAddCart = () => {
        let temp = "";
        const inventToRemove = []
        for (let i = 0; i < ingredientsRemoved.length; i++) {
            const ingred = removableIngredients[i]
            if (ingredientsRemoved[i]) {
                temp += "No " + ingred.ingredientname.toString() + ", ";
            }
            else {
                inventToRemove.push({ "inventid": ingred.inventid, "ingredientname": ingred.ingredientname, "quantity": ingred.quantity })
            }
        }
        for (let i = 0; i < otherIngredients.length; i++){
            const item = otherIngredients[i]
            inventToRemove.push({ "inventid": item.inventid, "ingredientname": item.ingredientname, "quantity": item.quantity })
        }
        temp = temp.slice(0, temp.length - 1)
        sendToTransaction(item, temp, inventToRemove)
    }


    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative">
                <div className="max-w-lg bg-white p-12 pb-4 rounded-lg shadow-lg">
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


                        <div className="flex flex-col">
                            {/* <div className="mb-8">
                                <h3 className="font-semibold text-3xl">
                                    {item.itemname}
                                </h3>
                                <hr className="border-[3px] border-black my-2" />
                                <h5 className="text-md"> {item.description}</h5>
                            </div> */}


                            <span className="ml-1 font-semibold text-2xl">
                                Customize
                                <hr className="border-[3px] border-black mb-1" />

                            </span>
                            <div>
                                {removableIngredients && removableIngredients.map((item, index) => (
                                    <button
                                        key={index}
                                        className={`rounded-md px-3 py-1 m-1 transition duration-100 ease-in-out 
                                                        ${ingredientsRemoved[index] ? 'line-through' : 'bg-gray-300 hover:bg-gray-400'}`}
                                        onClick={() => { handleIngredientClick(index) }}
                                    >
                                        {item.ingredientname}
                                    </button>
                                ))}
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
