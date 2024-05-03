"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const ChatComponent = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [pageContent, setPageContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  const fetchPageContent = async (url) => {
    try {
      const response = await axios.get(url);
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(response.data, "text/html");
      const plainText = getPlainTextFromElement(htmlDoc.body);
      return plainText;
    } catch (error) {
      console.error("Failed to fetch page content:", error);
      return "";
    }
  };  
  
  const getPlainTextFromElement = (element) => {
    let text = "";
    const children = element.childNodes;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent;
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
        text += getPlainTextFromElement(child) + " ";
      }
    }
    return text;
  };
  

  useEffect(() => {
    const fetchData = async () => {
        const aboutPageContent = await fetchPageContent("/about");
        const nutritionPageContent = await fetchPageContent("/nutrition");
        const currentPageContent = await fetchPageContent(window.location.href);
        var content = aboutPageContent + " " + nutritionPageContent + " " + currentPageContent;
        content += `[
            {
                "menuid": 7,
                "itemname": "Revs Grilled Chicken Sandwich",
                "price": 8.39,
                "category": 0,
                "description": "Marinated Juicy Chicken Breast served on a Toasted Bun and Topped with Veggies.",
                "Calories": 400,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 8,
                "itemname": "Spicy Chicken Sandwich",
                "price": 8.39,
                "category": 0,
                "description": "Country Breaded Chicken Breast Patty smothered in Fresh Ranch Buffalo Sauce and shredded Lettuce in a Toasty Bun.",
                "Calories": 550,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 9,
                "itemname": "Aggie Chicken Club",
                "price": 8.39,
                "category": 0,
                "description": "Crispy Chicken Breast, American Swiss Cheese, Bacon, and Fresh Avocado on a Toasted Bun.",
                "Calories": 780,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 10,
                "itemname": "2 corn dog value meal",
                "price": 4.99,
                "category": 1,
                "description": "2 All Beef Corn Dogs with your choice of Ketchup, Mustard, Onion, & Relish.",
                "Calories": 560,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 11,
                "itemname": "2 hot dog value meal",
                "price": 4.99,
                "category": 1,
                "description": "2 All Beef Hot Dogs with your choice of Ketchup, Mustard, Onion, & Relish.",
                "Calories": 320,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 12,
                "itemname": "3 tender entree",
                "price": 4.99,
                "category": 2,
                "description": "3 Crispy Chicken Tenders. Make it a meal and add Fries and a Drink!",
                "Calories": 300,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 13,
                "itemname": "3 Chicken Tender Combo",
                "price": 7.99,
                "category": 2,
                "description": "Three Crispy Chicken Tenders served with a side of French Fries and a Drink.",
                "Calories": 610,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 14,
                "itemname": "French Fries",
                "price": 1.99,
                "category": 3,
                "description": "Salted French Fries",
                "Calories": 350,
                "specialdiet": 3,
                "allergy": 0
            },
            {
                "menuid": 15,
                "itemname": "Aggie Shakes",
                "price": 4.49,
                "category": 4,
                "description": "Handspun Milkshake",
                "Calories": 229,
                "specialdiet": 3,
                "allergy": 0
            },
            {
                "menuid": 16,
                "itemname": "Cookie ice cream sundae",
                "price": 4.69,
                "category": 4,
                "description": "Vanilla Ice Cream sandwiched between 2 Cookies",
                "Calories": 300,
                "specialdiet": 3,
                "allergy": 1
            },
            {
                "menuid": 17,
                "itemname": "Double Scoop ice cream",
                "price": 3.29,
                "category": 4,
                "description": "A Double Scoop of Ice Cream",
                "Calories": 225,
                "specialdiet": 3,
                "allergy": 0
            },
            {
                "menuid": 18,
                "itemname": "Root beer float",
                "price": 5.49,
                "category": 4,
                "description": "16 oz cup with 2 scoops of Vanilla Ice Cream with Root beer!",
                "Calories": 331,
                "specialdiet": 3,
                "allergy": 0
            },
            {
                "menuid": 19,
                "itemname": "16 oz aquafina water",
                "price": 1.79,
                "category": 5,
                "description": "16 oz Bottled Water",
                "Calories": 0,
                "specialdiet": 0,
                "allergy": 0
            },
            {
                "menuid": 20,
                "itemname": "20 oz aquafina water",
                "price": 2.19,
                "category": 5,
                "description": "20 oz Bottled Water",
                "Calories": 0,
                "specialdiet": 0,
                "allergy": 0
            },
            {
                "menuid": 21,
                "itemname": "20 oz fountain drink",
                "price": 1.99,
                "category": 5,
                "description": "Cold 20 oz Fountain Beverage",
                "Calories": 90,
                "specialdiet": 0,
                "allergy": 0
            },
            {
                "menuid": 22,
                "itemname": "Chicken Caesar Salad",
                "price": 8.29,
                "category": 6,
                "description": "A classic salad with romaine lettuce, grilled chicken, croutons, and Caesar dressing.",
                "Calories": 330,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 1,
                "itemname": "Bacon Cheeseburger",
                "price": 8.29,
                "category": 0,
                "description": "Our signature Beef Patty topped with Crispy Bacon and American cheese on a Toasty Bun.",
                "Calories": 700,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 2,
                "itemname": "Classic Hamburger",
                "price": 6.89,
                "category": 0,
                "description": "Single Beef patty topped with fresh lettuce, pickles, tomatoes, and onions.",
                "Calories": 250,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 3,
                "itemname": "Double Stack Burger",
                "price": 9.99,
                "category": 0,
                "description": "Two high-quality Beef Patties, Two slices of American cheese, our signature Gig ‘Em sauce and pickles!",
                "Calories": 600,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 4,
                "itemname": "Gig Em Patty Melt",
                "price": 7.59,
                "category": 0,
                "description": "Beef patty served on buttery Texas Toast, slathered in Gig ‘Em sauce, and served with Caramelized Onions and American Swiss Cheese.",
                "Calories": 800,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 5,
                "itemname": "Cheeseburger",
                "price": 6.89,
                "category": 0,
                "description": "One sizzling patty topped with rich American cheese, signature Gig ‘Em sauce, and pickles.",
                "Calories": 350,
                "specialdiet": 0,
                "allergy": 1
            },
            {
                "menuid": 6,
                "itemname": "Black bean Burger",
                "price": 6.49,
                "category": 0,
                "description": "Chipotle Black Bean Patty served on a Toasted Bun with Veggies.",
                "Calories": 200,
                "specialdiet": 3,
                "allergy": 1
            },
            {
                "menuid": 23,
                "itemname": "Tuna Melt",
                "price": 7.99,
                "category": 6,
                "description": "A warm sandwich featuring tuna salad, melted cheese, and toasted bread.",
                "Calories": 456,
                "specialdiet": 2,
                "allergy": 1
            },
            {
                "menuid": 24,
                "itemname": "Fish Sandwich",
                "price": 7.99,
                "category": 6,
                "description": "A breaded and fried fish fillet served on a bun with toppings like lettuce and tartar sauce.",
                "Calories": 379,
                "specialdiet": 2,
                "allergy": 1
            }
        ]
        `
        setPageContent(content);
      };
    
      fetchData();  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    try {
      setIsLoading(true);
      const userMessage = { role: "user", content: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a an AI assistant that helps customers order from Rev's Grill, a premier location for burgers, wings, shakes, and much more. ONLY answer questions related to Rev's Grill, and tell users that you can only assist them with topics related to Rev's Grill if they ask you to do something unrelated. Only answer questions with the information you are provided below. Allergy 0 indicates that the item is gluten-free. Allergy 1 indicates that there is gluten. Specialdiet 1 is vegetarian, 2 is pescetarian, and 3 is both. 0 indicates that there is no special dietary restriction." },
            { role: "system", content: `Page content: ${pageContent}` },
            ...messages,
            userMessage,
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
          },
        }
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: response.data.choices[0].message.content,
        },
      ]);
      setInput("");
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
    }
  };

  const enterHandler = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      setInput("");
    }
  };

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div
      className={`fixed bottom-0 left-0 bg-neutral-300 rounded-2xl p-2 flex flex-col justify-end max-h-[40vh] w-1/2 md:w-1/4 ${
        messages.length !== 0 ? "gap-2" : ""
      }`}
    >
      <div
        className="flex-grow-0 overflow-y-auto flex flex-col gap-2 rounded-t-2xl"
        ref={messagesContainerRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${message.role} flex p-2  w-5/6 ${
              message.role === "user"
                ? "bg-gray-100 rounded-l-2xl rounded-tr-2xl self-end"
                : "bg-white rounded-r-2xl rounded-tl-2xl self-start"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading ? <div>Loading...</div> : ""}
      </div>
      <div className="gap-2 flex h-[8vh]">
        <textarea
          className="rounded-xl px-2 flex-grow resize-none"
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDownCapture={enterHandler}
          placeholder="Ask a question!"
        />
        <button
          className="px-4 bg-red-800 text-white rounded-xl"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
