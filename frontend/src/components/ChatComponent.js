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
        const content = aboutPageContent + " " + nutritionPageContent + " " + currentPageContent;
        console.log(content);
        setPageContent({ aboutPageContent, nutritionPageContent, currentPageContent });
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
            { role: "system", content: "You are a an AI assistant that helps customers order from Rev's Grill, a premier location for burgers, wings, shakes, and much more. ONLY answer questions related to Rev's Grill, and tell users that you can only assist them with topics related to Rev's Grill if they ask you to do something unrelated. You help customers order, reccomending items, and tell them information about Rev's Grill." },
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
