"use client";

import React, { useState } from 'react';
import { useTransaction } from "@/components/transactions/TransactionContext";
import Carousel from "react-multi-carousel";
import Link from "next/link";
import Image from "next/image";
import "react-multi-carousel/lib/styles.css";
import { useRouter } from 'next/navigation';
import WeatherWidget from "@/components/WeatherAPI";

const customStyles = {
  orderButton: {
    backgroundColor: 'transparent',
    border: '2px solid #ffffff',
    padding: '10px 20px',
    borderRadius: '20px', 
    fontWeight: 'bold',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  orderButtonHover: {
    backgroundColor: '#ffffff',
    color: 'maroon', 
  },
  carouselContent: {
    textAlign: 'left', 
    color: '#ffffff',
    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', 
    height: '100%', 
    paddingLeft: '1px', 
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  arrowButton: {
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '24px',
    padding: '10px',
    borderRadius: '50%',
    zIndex: 0,
    border: 'none',
    opacity: 0.8,
    transition: 'opacity 0.3s ease',
  },
  arrowButtonHover: {
    opacity: 1,
  },
  carouselBackground: {
    backgroundColor: 'maroon',
  },
  description: {
    fontSize: '1rem',
    fontWeight: '400', 
    marginBottom: '1rem', 
  },
};

const ArrowLeft = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{ ...customStyles.arrowButton, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
    onMouseEnter={(e) => e.target.style.opacity = '1'}
    onMouseLeave={(e) => e.target.style.opacity = '0.5'}
  >
    &lt;
  </div>
);

const ArrowRight = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{ ...customStyles.arrowButton, position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}
    onMouseEnter={(e) => e.target.style.opacity = '1'}
    onMouseLeave={(e) => e.target.style.opacity = '0.5'}
  >
    &gt;
  </div>
);

const googleClientID = '821375678963-ors2l4rh0gpqqlmq3p8ddg9pptv5fsqi.apps.googleusercontent.com'
const buttonCategories = [
  { phrase: "Burgers", path: "/Burgers", image: "/menuItems/ClassicHamburger.jpeg" },
  {
    phrase: "Hotdogs/Corndogs",
    path: "/Dogs",
    image: "/menuItems/2corndogvaluemeal.jpeg",
  },
  {
    phrase: "Chicken Tenders",
    path: "/Tenders",
    image: "/menuItems/3tenderentree.jpeg",
  },
  { phrase: "Sides", path: "/Sides", image: "/menuItems/FrenchFries.jpeg" },
  { phrase: "Shakes", path: "/Desserts", image: "/menuItems/AggieShakes.jpeg" },
  { phrase: "Beverages", path: "/Beverages", image: "/menuItems/20ozfountaindrink.jpeg" },
  { phrase: "Seasonal", path: "/Seasonal", image: "/menuItems/ChickenCaesarSalad.jpeg" },
];

const carouselHotCategories = [
  {
    id: 2,
    name: "Classic Hamburger",
    phrase: "Order the classic hamburger today!",
    description:
      "Cheese, Lettuce, Tomatoes, Onions, and our signature patty all on artisan bread. Handcrafted with love by Rev's Grill!",
    image: "/menuItems/ClassicHamburger.jpeg",
    price: 6.89
  },
  {
    id: 4,
    name: "Gig Em Patty Melt",
    phrase: "Try the all new Gig Em Patty Melt!",
    description:
      "This revolutionary sandwich will turn even the staunchest of 2%ers into redasses in no time!",
    image: "/menuItems/GigEmPattyMelt.jpeg",
    price: 7.59
  },
];

const carouselColdCategories = [
  {
    id: 16,
    name: "Cookie ice cream sundae",
    phrase: "Indulge in our Cookie Ice Cream Sundae!",
    description:
      "Layers of freshly baked cookies topped with rich vanilla ice cream. A sweet treat to satisfy your cravings!",
    image: "/menuItems/Cookieicecreamsundae.jpeg",
    price: 4.69
  },
  {
    id: 22,
    name: "Chicken Caesar Salad",
    phrase: "Enjoy our Fresh Chicken Caesar Salad!",
    description:
      "Crisp romaine lettuce, juicy grilled chicken, shredded parmesan cheese, croutons, and a creamy Caesar dressing. Perfect for a refreshing and healthy meal!",
    image: "/menuItems/ChickenCaesarSalad.jpeg",
    price: 8.29
  },
];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1,
  }
};

const Home = () => {
  const [temperature, setTemperature] = useState(null);
  const { updateTransaction } = useTransaction();
  const [isHovered, setIsHovered] = useState(false);

  let displayCategories;

  const handleWeatherLoaded = (temp) => {
    setTemperature(temp);
  };

  const getMenuItemIngredients = async (item) => {
    try {

        const name = item.name
        const params = name.split(' ').join("+")

        const response = await fetch(`http://localhost:5000/api/menuitems/getIngreds?itemName=${params}`);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const paramsNeeded = data.map(obj => ({"inventid": obj.inventid, "ingredientname": obj.ingredientname, "quantity": obj.quantity}))
        return paramsNeeded

    } catch (error) {
        console.error("Error fetching ingredient for menu item:", error);
    }
};

  const handleOrder = async(item) => {
    const ingreds = await getMenuItemIngredients(item);

    updateTransaction({
      id: item.id,
      itemname: item.name,
      price: item.price,
      quantity: 1,
      modif: "",
      itemToRemove: ingreds
    });
  };

  if (temperature >= 70) {
      displayCategories = carouselColdCategories;
  } else {
      displayCategories = carouselHotCategories;
  }  
  const router = useRouter()


  return (
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex items-center justify-center space-x-4 mt-5">
          <WeatherWidget onWeatherLoaded={handleWeatherLoaded} />
        </div>
        <Carousel
          swipeable
          draggable
          responsive={responsive}
          ssr
          infinite
          autoPlay
          autoPlaySpeed={6000}
          keyBoardControl
          customTransition="all .5s ease-in-out"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          itemClass="carousel-item-padding-40-px w-full"
          customLeftArrow={<ArrowLeft />}
          customRightArrow={<ArrowRight />}
          className="w-full relative"
        >
          {displayCategories.map((category, index) => (
            <div key={index} className="carousel-item px-4" style={customStyles.carouselBackground}>
              <div className="container flex flex-wrap justify-center items-center">
                <div className="w-full sm:w-1/2 p-4">
                  <img src={category.image} alt={category.phrase} className="carousel-image max-h-64 w-auto mx-auto" />
                </div>
                <div className="w-full sm:w-1/2 p-4" style={customStyles.carouselContent}>
                  <h3 style={customStyles.heading}>{category.name}</h3>
                  <p style={customStyles.description}>{category.description}</p>
                  <button
                    style={isHovered ? { ...customStyles.orderButton, ...customStyles.orderButtonHover } : customStyles.orderButton}
                    onClick={() => handleOrder(category)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
        <div className="container px-10 mx-auto mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buttonCategories.map((category) => (
              <Link key={category.phrase} href={category.path}>
                <div className="m-4 cursor-pointer aspect-square transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl border-[#877F7D] border-2 rounded-lg">
                  <div className="overflow-hidden rounded-lg">
                    <img className="w-full rounded-t-lg" src={`${category.image}`} alt={category.phrase} />
                    <div className="py-4 rounded-b-lg bg-white shadow text-center">
                      <span className="text-3xl font-bold bg-clip-text text-transparent bg-black">
                        {category.phrase}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
  );
};

export default Home;
