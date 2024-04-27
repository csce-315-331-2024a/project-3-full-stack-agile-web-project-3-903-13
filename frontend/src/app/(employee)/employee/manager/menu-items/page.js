  "use client"

  import { useEffect, useState } from "react";
  import { FaTrash } from "react-icons/fa";

  export const getMenuItems = async () => {
    const items = await fetch("http://localhost:5000/api/menuitems");
    const data = await items.json();
    
    return data;
  };

  export const getMenuItemIngredients = async (menuItem) => {
    try {
      // Construct the query string from the menuItem object
      const queryString = new URLSearchParams(menuItem).toString();
      
      // Append the query string to the URL
      const url = `http://localhost:5000/api/menuitems/getIngreds?${queryString}`;

      // Make the GET request
      const response = await fetch(url);

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching ingredient for menu item:", error);
      throw error;
    }
  };

  export const getMenuItemsWithIngredients = async () => {
    try {
      // Fetch menu items
      const items = await fetch("http://localhost:5000/api/menuitems");
      const data = await items.json();
  
      // Fetch ingredients for each menu item
      const menuItemsWithIngredients = await Promise.all(
        data.map(async (menuItems) => {
          console.log(menuItems.itemname);

          const ingredients = await getMenuItemIngredients({ itemName: menuItems.itemname });
          return { ...menuItems, ingredients };
        })
      );
  
      return menuItemsWithIngredients;
    } catch (error) {
      console.error("Error fetching menu items with ingredients:", error);
      throw error;
    }
  };
  


  export const getInventoryItems = async () => {
    const items = await fetch("http://localhost:5000/api/inventory");
    const data = await items.json();

    return data;
  };

  export const addMenuItem = async (menuItem) => {
    const response = await fetch("http://localhost:5000/api/menuitems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuItem),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    } else {
      return { success: true, message: "Menu item added successfully" };
    }
  };

  export const updateMenuItemPrice = async (menuItem) => {
    const response = await fetch("http://localhost:5000/api/menuitems/updatePrice", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuItem),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    } else {
      return { success: true, message: "Menu item price updated successfully" };
    }
  };

  export const updateMenuItemCat = async (menuItem) => {
    const response = await fetch("http://localhost:5000/api/menuitems/updateCat", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuItem),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    } else {
      return { success: true, message: "Menu item category updated successfully" };
    }
  };

  export const updateMenuItemIngred = async (menuItem) => {
    const response = await fetch("http://localhost:5000/api/menuitems/updateIngred", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuItem),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    } else {
      return { success: true, message: "Menu item ingredients updated successfully" };
    }
  };

  export const removeMenuItem = async (menuItem) => {
    const response = await fetch("http://localhost:5000/api/menuitems", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuItem),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    } else {
      return { success: true, message: "Menu item removed successfully" };
    }
  };

  const updateCategories = [
    { label: "Update Price", value: 0 },
    { label: "Update Category", value: 1 },
    { label: "Update Ingredients", value: 2 },
  ];

  const categories = [
    { label: "Burgers/Sandwiches", value: 0 },
    { label: "Corn Dogs/Hot Dogs", value: 1 },
    { label: "Chicken Tenders", value: 2 },
    { label: "French Fries", value: 3 },
    { label: "Shakes/Ice Cream", value: 4 },
    { label: "Beverages", value: 5 },
    { label: "Seasonal", value: 6 },
  ];

  export default function ManagerPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [addItemName, setAddItemName] = useState(""); // Separate state variable for Add Menu Item form
    const [addPrice, setAddPrice] = useState(""); // Separate state variable for Add Menu Item form
    const [addItemCategory, setAddItemCategory] = useState(0); // Separate state variable for Add Menu Item form
    const [updateItemName, setUpdateItemName] = useState(""); // Separate state variable for Update Menu Item form
    const [updatePrice, setUpdatePrice] = useState(""); // Separate state variable for Update Menu Item form
    const [updateCat, setUpdateCat] = useState(0); // Separate state variable for Update Menu Item form
    const [updateErrorMessage, setUpdateErrorMessage] = useState("");
    const [addErrorMessage, setAddErrorMessage] = useState("");
    const [updateSuccessMessage, setUpdateSuccessMessage] = useState("");
    const [addSuccessMessage, setAddSuccessMessage] = useState("");
    const [ingredients, setIngredients] = useState([]); // State variable for ingredients
    const [initialInventoryItems, setInitialInventoryItems] = useState([]); // Add this line
    const [updateIngred, setUpdateIngred] = useState([]); // State variable for ingredients
    const [inventoryItems, setInventoryItems] = useState(
      initialInventoryItems.map(item => ({ ...item, disabled: false }))
    ); // Initialize inventoryItems with disabled property
    const [isSeasonal, setIsSeasonal] = useState(false); // State for seasonal checkbox
    const [expirationDate, setExpirationDate] = useState(""); // State for expiration date
    const [updateCategory, setUpdateCategory] = useState(""); // State for expiration date
    const [selectedMenuItem, setSelectedMenuItem] = useState("");
    const [removeItemName, setRemoveMenuItem] = useState("");
    const [removeErrorMessage, setRemoveErrorMessage] = useState("");
    const [removeSuccessMessage, setRemoveSuccessMessage] = useState("");
    const [menuItemsGrid, setMenuItemsGrid] = useState([]);

    useEffect(() => {
      fetchMenuItems();
      fetchInventoryItems();
      fetchMenuItemsWithIngredients();
    }, []);

    const fetchMenuItems = async () => {
      try {
        const data = await getMenuItems();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    const fetchMenuItemsWithIngredients = async () => {
      try {
        const data = await getMenuItemsWithIngredients();
        setMenuItemsGrid(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching menu items with ingredients:", error);
      }
    };

    const fetchInventoryItems = async () => {
      try {
        const data = await getInventoryItems();
        setInventoryItems(data);
      } catch (error) {
        console.error("Error fetching inventory items:", error);
      }
    };

    const getCategoryLabel = (categoryValue) => {
      const category = categories.find(cat => cat.value === categoryValue);
      return category ? category.label : "Unknown";
    };

    const handleAddMenuItem = async (e) => {
      e.preventDefault();

      if (!validateItemName(addItemName) || !validatePrice(addPrice)) {
        setAddErrorMessage("Please fill out all fields correctly.");
        return;
      }

      try {
        const response = await addMenuItem({ itemName: addItemName, price: addPrice, category: addItemCategory, ingredients, isSeasonal: isSeasonal, expirationDate: expirationDate  });
        setAddSuccessMessage(response.message);
        setAddErrorMessage("");
        setAddItemName("");
        setAddPrice("");
        setAddItemCategory(0); // Reset category to default value after successful submission
        setIngredients([]); // Clear ingredients after adding the menu item
        setIsSeasonal(false);
        setExpirationDate("");
        fetchMenuItems();
      } catch (error) {
        setAddErrorMessage(error.message);
      }
    };

    const handleRemoveMenuItem = async (e) => {
      e.preventDefault();


      try {
        const response = await removeMenuItem({ itemName: removeItemName });
        setRemoveSuccessMessage(response.message);
        setRemoveErrorMessage("");
        setRemoveMenuItem("");
        fetchMenuItems();
      } catch (error) {
        setRemoveErrorMessage(error.message);
        setRemoveSuccessMessage("");
      }
    };

    const handleIngredientSelection = (e, index) => {
      const selectedInventoryItem = inventoryItems.find(item => item.ingredientname === e.target.value);
      if (selectedInventoryItem) {
        // Check if the selected inventory item is already used in another ingredient
        const isAlreadyUsed = ingredients.some((ingredient, i) => i !== index && ingredient.name === selectedInventoryItem.ingredientname);
        if (isAlreadyUsed) {
          alert("This inventory item is already selected in another ingredient. Please choose a different one.");
          return;
        }
    
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = { inventID: selectedInventoryItem.inventid, name: selectedInventoryItem.ingredientname, quantity: 1 };
        setIngredients(updatedIngredients);
    
        // Disable the selected option in the dropdown
        const updatedInventoryItems = inventoryItems.map(item => {
          if (item.ingredientname === e.target.value) {
            return { ...item, disabled: true };
          }
          return item;
        });
        setInventoryItems(updatedInventoryItems);
      }
    };
    

    const handleQuantityChange = (e, index) => {
      const updatedIngredients = [...ingredients];
      updatedIngredients[index].quantity = parseInt(e.target.value);
      setIngredients(updatedIngredients);
    };

    const addIngredient = () => {
      setIngredients([...ingredients, { inventID: null, name: "", quantity: 1 }]);
    };

    const removeIngredient = (index) => {
      const updatedIngredients = [...ingredients];
      updatedIngredients.splice(index, 1);
      setIngredients(updatedIngredients);
    };

    

    const handleUpdateMenuItem = async (e) => {
      e.preventDefault();

      
      try {
        let response;
        if (updateCategory == 0){
          if (!validatePrice(updatePrice)) {
            setUpdateErrorMessage("Please fill out all fields correctly.");
            return;
          }
          response = await updateMenuItemPrice({ itemName: updateItemName, newPrice: updatePrice });
        } else if (updateCategory == 1){
          response = await updateMenuItemCat({ itemName: updateItemName, newCat: updateCat });
        } else if (updateCategory == 2){
          response = await updateMenuItemIngred({ itemName: selectedMenuItem, ingredients: updateIngred });
        }
        
        setUpdateSuccessMessage(response.message);
        setUpdateErrorMessage("");
        setUpdateItemName("");
        setUpdatePrice("");
        setUpdateCat(0);
        fetchMenuItems();
      } catch (error) {
        setUpdateErrorMessage(error.message);
      }
    };

    const validateItemName = (itemName) => {
      return itemName.trim() !== "";
    };

    const validatePrice = (price) => {
      return !isNaN(parseFloat(price)) && isFinite(price) && parseFloat(price) > 0;
    };

    
    const handleUpdateIngredientName = (e, index) => {
      const updatedIngredients = [...updateIngred];
      const selectedInventoryItem = inventoryItems.find(item => item.ingredientname === e.target.value);
    
      // Check if the selected inventory item is already used in another ingredient
      const isAlreadyUsed = updatedIngredients.some((ingredient, i) => i !== index && ingredient.name === selectedInventoryItem.ingredientname);
      if (isAlreadyUsed) {
        alert("This inventory item is already selected in another ingredient. Please choose a different one.");
        return;
      }
    
      // Check if the selected inventory item is "Select Inventory Item"
      if (e.target.value === "Select Inventory Item") {
        return; // Do nothing if "Select Inventory Item" is selected
      }
    
      if (selectedInventoryItem) {
        updatedIngredients[index] = { inventID: selectedInventoryItem.inventid, name: selectedInventoryItem.ingredientname, quantity: updatedIngredients[index].quantity };
        setUpdateIngred(updatedIngredients);
      }
    };
    
    

    const handleUpdateIngredientQuantity = (e, index) => {
      const updatedIngredients = [...updateIngred];
      const originalIngredient = updatedIngredients[index]; // Store the original ingredient object
      console.log("Original Ingredient:", originalIngredient);
      updatedIngredients[index] = { ...originalIngredient, quantity: parseInt(e.target.value) };
      console.log("Updated Ingredient:", updatedIngredients[index]);
      setUpdateIngred(updatedIngredients);
    };
    
    
    
    const handleRemoveUpdateIngredient = (index) => {
      const updatedIngredients = [...updateIngred];
      updatedIngredients.splice(index, 1);
      setUpdateIngred(updatedIngredients);
    
      // Enable the removed inventory item in the dropdown
      const removedIngredient = updateIngred[index];
      const updatedInventoryItems = inventoryItems.map(item => {
        if (item.inventid === removedIngredient.inventID) {
          return { ...item, disabled: false };
        }
        return item;
      });
      setInventoryItems(updatedInventoryItems);
    };
    
    

    const handleAddUpdateIngredientField = () => {
      const selectedInventoryItem = inventoryItems.find(item => !item.disabled); // Find the first enabled inventory item
      if (selectedInventoryItem) {
        // Check if the selected inventory item is already present in updateIngred
        const isAlreadyUsed = updateIngred.some(ingredient => ingredient.inventID === selectedInventoryItem.inventid);
        if (isAlreadyUsed) {
          alert("This inventory item is already selected as an ingredient. Please choose a different one.");
          return;
        }
    
        setUpdateIngred([...updateIngred, { inventID: selectedInventoryItem.inventid, name: selectedInventoryItem.ingredientname, quantity: 1 }]);
        // Disable the selected option in the dropdown
        const updatedInventoryItems = inventoryItems.map(item => {
          if (item.inventid === selectedInventoryItem.inventid) {
            return { ...item, disabled: true };
          }
          return item;
        });
        setInventoryItems(updatedInventoryItems);
      }
    };
    
    
    
    
    const handleMenuItemSelection = async (e) => {
      const selectedMenuItemName = e.target.value;
      console.log(selectedMenuItemName);
      setSelectedMenuItem(selectedMenuItemName);
    
      try {
        // Fetch ingredients for the selected menu item
        const data = await getMenuItemIngredients({itemName: selectedMenuItemName});
        
        // Modify the data to include inventID
        const updatedData = data.map(ingredient => ({ ...ingredient, inventID: ingredient.inventid }));
    
        setUpdateIngred(updatedData);
        console.log(updatedData);
      } catch (error) {
        console.error("Error fetching ingredients for menu item:", error);
      }
    };
    
    

    return (
      <main className="min-h-screen flex flex-col">
		<h1 className="text-4xl font-bold text-center mb-3 py-4">
				Menu Hub
			</h1>
        <div  className="w-full  max-w-screen-xl mx-auto">
          <div className="flex justify-between mb-8">
            <div className="w-1/2 md:w-1/3 flex flex-col items-center ">
              <h1 className="p-3 md:p text-xl font-semibold text-center ">ADDING MENU ITEMS</h1>
              {addErrorMessage && (
                <p className="text-red-500"  role="alert" aria-live="assertive" >{addErrorMessage}</p>
              )}
              {addSuccessMessage && (
                <p className="text-green-500"  role="status" aria-live="polite" >{addSuccessMessage}</p>
              )}
              <form onSubmit={handleAddMenuItem} className="flex flex-col items-center justify-center">
                <input 
                  type="text"
                  placeholder="Item Name"
                  value={addItemName}
                  onChange={(e) => setAddItemName(e.target.value)}
                  className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                  required
                  aria-label="Enter item name"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={addPrice}
                  onChange={(e) => setAddPrice(e.target.value)}
                  className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                  required
                  aria-label="Enter Price"
                />
                <div className="flex justify-between items-center mb-2 bg-white shadow-input outline-none border focus:border-red-800 rounded-lg px-2 py-2.5 ">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSeasonal}
                        onChange={(e) => setIsSeasonal(e.target.checked)}
                        className={`mb-1.5 px-4 justify-center items-center accent-red-800 form-checkbox h-4 w-5`}
                        aria-label="Checkbox if item is seasonal item"
                      />
                      <label className="ml-1 mb-2 justify-centere items-center">
                        Seasonal Item
                      </label>
                    </div>
                  </div>
                
                {/* Show expiration date input field if the item is seasonal */}
                {isSeasonal && (
                  <div className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5">
                    <p>Expiration Date:</p>
                    <input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      className="mb-2  border focus:border-red-800 rounded-lg px-2 py-1"
                      required
                    />
                  </div>
                )}
                <select
                  value={isSeasonal ? 6 : addItemCategory}
                  onChange={(e) => setAddItemCategory(parseInt(e.target.value))}
                  className="mb-1 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                  disabled={isSeasonal}
                  aria-label="Select category"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <h2 className="p-3 md:p text-xl font-semibold text-center">Ingredients</h2>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between mb-2 ">
                    <select
                      value={ingredients[index]?.name || ""}
                      onChange={(e) => handleIngredientSelection(e, index)}
                      className="w-full md:w-1/2 flex flex-col items-center mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-1"
                      required
                    >
                      <option value="">Select Inventory Item</option>
                      {inventoryItems.map(item => (
                        <option key={item.inventid} value={item.ingredientname}>{item.ingredientname}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={ingredient.quantity}
                      onChange={(e) => handleQuantityChange(e, index)}
                      className="w-full md:w-1/4 flex flex-col items-center mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-1 py-1"
                      required
                    />
                    <button type="button" className= "mb-2 flex flex-col items-center bg-red-800 text-white rounded px-4 py-2" onClick={() => removeIngredient(index)}>
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addIngredient} className=" mb-4 bg-gray-500 text-white rounded px-2 py-1" >Add Ingredient</button>
                <button type="submit" className="bg-red-800 text-white rounded px-4 py-2" aria-label="Add menu item confirmation button">ADD</button>
              </form>
          </div>
          <div className="w-full md:w-1/3 flex flex-col items-center">
          <h2 className=" p-3 md:p text-xl font-semibold text-center">UPDATE MENU ITEMS</h2>
          {updateErrorMessage && (
            <p className="text-red-500">{updateErrorMessage}</p>
          )}
          {updateSuccessMessage && (
            <p className="text-green-500">{updateSuccessMessage}</p>
          )}
          <form onSubmit={handleUpdateMenuItem} className="flex flex-col items-center justify-center">
            <select
                value = {updateCategory}
                onChange={(e) => setUpdateCategory(parseInt(e.target.value))}
                className= "mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                required
            >
              {updateCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            {updateCategory < 2 &&  (
              <select
              value={updateItemName}
              onChange={(e) => setUpdateItemName(e.target.value)}
              className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
            >
              <option value="">Select Menu Item</option>
              {menuItems.map(item => (
                <option key={item.menuid} value={item.itemname}>{item.itemname}</option>
              ))}
            </select>
            
            )
            }
            
            {updateCategory == 0 && (
              <input 
              type="number"
              placeholder="New Price"
              value={updatePrice}
              onChange={(e) => setUpdatePrice(e.target.value)}
              className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
              required
            />
            )}
            {updateCategory == 1 && (
            <select
            value={updateCat}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              console.log("Selected Category Value:", value);
              setUpdateCat(value);
            }}
            className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          
            )}
            {updateCategory === 2 && (
                <div className="w-full md:w-4/5 flex flex-col items-center justify-center">
                  <select
                    value={selectedMenuItem}
                    onChange={handleMenuItemSelection}
                    className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                  >
                    <option value="">Select Menu Item</option>
                    {menuItems.map(item => (
                      <option key={item.menuid} value={item.itemname}>{item.itemname}</option>
                    ))}
                  </select>
                  {/* Display ingredients for the selected menu item */}
                  {selectedMenuItem && (
                    <div className="flex flex-col items-center justify-center">
                      <h3>Ingredients for {selectedMenuItem}</h3>
                      {/* Display ingredients using dropdown for ingredient selection */}
                      {updateIngred.map((ingredient, index) => (
                        <div key={index} className="flex justify-between mb-2">
                          <select
                            value={ingredient.ingredientname} // Use inventoryItem property
                            onChange={(e) => handleUpdateIngredientName(e, index)}
                            className="w-full md:w-1/2 flex flex-col items-center mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-1"
                            required
                          >
                            {inventoryItems.map((inventoryItem, idx) => (
                              <option key={inventoryItem.inventid} value={inventoryItem.ingredientname}>{inventoryItem.ingredientname}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) => handleUpdateIngredientQuantity(e, index)}
                            className="w-full md:w-1/4 flex flex-col items-center mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-1 py-1"
                            required
                          />
                          <button type="button" className=" mb-2 flex flex-col items-center bg-red-800 text-white rounded px-4 py-2" onClick={() => handleRemoveUpdateIngredient(index)}>
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      {/* Add ingredient button */}
                      <button type="button" className= "mb-4 bg-gray-500 text-white rounded px-2 py-1 flex flex-col items-center" onClick={handleAddUpdateIngredientField}>Add Ingredient</button>
                    </div>
                  )}
                </div>
              )}

            
            <button type="submit" className="bg-red-800 text-white rounded px-4 py-2">UPDATE</button>
          </form>
          </div>
          <div className="w-full md:w-1/3 flex flex-col items-center">
          <h1 className="p-3 md:p p-3 text-xl font-semibold text-center">REMOVING MENU ITEMS</h1>
          {removeErrorMessage && (
            <p className="text-red-500">{removeErrorMessage}</p>
          )}
          {removeSuccessMessage && (
            <p className="text-green-500">{removeSuccessMessage}</p>
          )}
          <form onSubmit={handleRemoveMenuItem} className = "flex flex-col items-center justify-center">
            <select
                  value={removeItemName}
                    onChange={(e) =>setRemoveMenuItem(e.target.value)}
                    className="mb-2 shadow-input outline-none border focus:border-red-800 rounded-lg px-4 py-2.5"
                  >
                    <option value="">Select Menu Item</option>
                    {menuItems.map(item => (
                      <option key={item.menuid} value={item.itemname}>{item.itemname}</option>
                    ))}
            </select>
            <button type="submit" className = "bg-red-800 text-white rounded px-4 py-2">REMOVE</button>
          </form>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
        {menuItemsGrid.map((item) => (
          <div
            key={item.menuid}
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            role = "region"
            aria-labelledby={`menu-item-${item.menuid}`}
          >
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {item.itemname}
            </h5>
            <p className="mb-4 p-2 bg-gray-200 rounded-lg">Price: {item.price}</p>
            <p className=" mb-4 p-2 bg-gray-200 rounded-lg">Category: {getCategoryLabel(item.category)}</p>
            <div className="p-2 pt-1 bg-gray-200 rounded-lg">
            <h6 className="mt-4 mb-2 text-lg font-semibold">Ingredients:</h6>
            <ul>
                {item.ingredients.map((ingredient, index) => {
                  return (
                    <li key={index}>
                      {ingredient.ingredientname}: {ingredient.quantity}
                    </li>
                  );
                })}
            </ul>
            </div>
            
          </div>
        ))}
        </div>
          
          
        </div>
        
      </main>
    );
  }
  ``
