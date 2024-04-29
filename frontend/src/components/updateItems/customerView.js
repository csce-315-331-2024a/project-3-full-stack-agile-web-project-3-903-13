import React, { useEffect, useState } from "react";
// import Link from 'next/link'
import Image from 'next/image'
import { useTransaction } from "@/components/transactions/TransactionContext";
import { toast } from 'react-toastify';




const Message = ({ closeToast, toastProps, name, displayText, recList}) => {
    const { updateTransaction, transactions } = useTransaction();

    const sendToTransaction = (dish, inventToRemove) => {
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
            "quantity": quantity, "modif": "", "inventToRemove": inventToRemove
        });
    };

    
    
    const handleAddCartClick = () => {

        for (let i = 0; i < recList.length; i++){
            const el = recList[i]
            // console.log(el)
            // console.log(el.dish[0])
            // console.log(el.inventToRemove)
            // console.log("BLAH")
            sendToTransaction(el.dish[0], el.inventToRemove)
        }
    }

    const stuff = displayText.split("@");

    return (
        <div className="flex flex-col">
            <div className="m-4">{name} added to cart!</div>
            <div className="m-4">{stuff[0]}</div>
            <div> </div>

            <button 
                onClick={() => {handleAddCartClick()}}
                className="bg-red-800 font-semibold text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 hover:text-black 
                transition duration-200 ease-in-out"> {stuff[1]} </button> 
        </div>
    );
};

export default function UpdateModal({ isCustomizable, isOpen, onClose, item, categoryIndex}) {

    // Other ingredients contains non-removable ingredients like bags, utensils, etc.
    // removable ingredients contains those that CAN be removed
    // ingredientsRemoved is mainly a boolean array to track which ingredients have been removed by the User
    const [otherIngredients, setOtherIngredients] = useState()
    const [removableIngredients, setRemovableIngredients] = useState()
    const [ingredientsRemoved, setIngredientsRemoved] = useState([]);

    const [itemNamesRec, setItemNamesRec] = useState([])
    const [recString, setRecString] = useState("")
    const [recAdd, setRecAdd] = useState([]);


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

        toast(<Message name={dish.itemname} displayText={recString} recList = {recAdd} />)
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

    }, [item]);


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
        // console.log(otherIngredients)
        for (let i = 0; i < ingredientsRemoved.length; i++) {
            const ingred = removableIngredients[i]
            if (ingredientsRemoved[i]) {
                temp += "No " + ingred.ingredientname.toString() + ", ";
            }
            else {
                inventToRemove.push({ "inventid": ingred.inventid, "ingredientname": ingred.ingredientname, "quantity": ingred.quantity })
            }
        }

        for (let i = 0; i < otherIngredients.length; i++) {
            const item = otherIngredients[i]
            inventToRemove.push({ "inventid": item.inventid, "ingredientname": item.ingredientname, "quantity": item.quantity })
        }

        temp = temp.slice(0, temp.length - 1)
        sendToTransaction(item, temp, inventToRemove)
    }


    const determineRecStuff = async(category) => {
        let string = "";
        let itemsToRecommend = [];
        switch (category) {
            case 0:
            case 1: 
            case 2:
                itemsToRecommend.push("20 oz fountain drink", "French Fries") 
                string = "Why not make your meal a combo today by adding a drink and fries? @ Make a combo ";
                break;
            case 3: 
            case 4: 
            case 5: 
                const burgers = ["Spicy Chicken Sandwich", "Double Stack Burger", "Black bean Burger", "Bacon Cheeseburger"]
                const randomIndex = Math.floor(Math.random() * burgers.length);
                const randomBurger = burgers[randomIndex];

                itemsToRecommend.push(randomBurger)
                string = `Would you care for one of our hand crafted sizzling burgers today good ol' customer? @ Add a ${randomBurger}`;
                break;
            case 6: 
                const desert = ["Aggie Shakes", "Cookie ice cream sundae", "Double Scoop ice cream", "Root beer float"]
                const rI = Math.floor(Math.random() * desert.length);
                const randomDesert = desert[rI];

                itemsToRecommend.push(randomDesert)
                string = `How about a cool desert today to accompy the item? @ Add ${randomDesert}`;
                break;   
        }
        
        // console.log(string)
        // console.log(itemsToRecommend)

        setItemNamesRec(itemsToRecommend)
        setRecString(string)

        const tempRecAdd = await fetchDetailsForRecommendations(itemsToRecommend)
        // console.log(tempRecAdd)

        setRecAdd(tempRecAdd)
    }

    const fetchItemDetails = async (itemName) => {
        const params = itemName.split(' ').join("+");
        
        const ingreds = await fetch(`http://localhost:5000/api/menuitems/getIngreds?itemName=${params}`);
        if (!ingreds.ok) {
            const errorMessage = await ingreds.text();
            throw new Error(errorMessage);
        }
        const ingredients = await ingreds.json();
        const neededDetails = ingredients.map(item => ({"inventid": item.inventid, "ingredientname": item.ingredientname, "quantity": item.quantity}))
    
        const response = await fetch(`http://localhost:5000/api/menuitems/specific?name=${params}`);
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        const details = await response.json();
    
        return { dish: details, inventToRemove: neededDetails };
    };

    const fetchDetailsForRecommendations = async (itemstoRecommend) => {
        const detailsPromises = await itemstoRecommend.map(itemName => fetchItemDetails(itemName));
        const itemDetails = await Promise.all(detailsPromises);
        return itemDetails;
    };


    useEffect(() => {
        const fetchData = async () => {
            await determineRecStuff(categoryIndex);
        };
        if (isOpen){
            fetchData()
        }
    
    }, [item, isOpen]); 



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

                                {isCustomizable && (
                                    <div>
                                        <span className="ml-1 font-semibold text-xl">
                                            Customize
                                            <hr className="border-[3px] border-black mb-1 w-28" />

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
                                )}

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
