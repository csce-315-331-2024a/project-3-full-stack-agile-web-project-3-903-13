"use client";

import React, { useState } from 'react';
import { useTransaction } from "@/components/transactions/TransactionContext";
import Carousel from "react-multi-carousel";
import Link from "next/link";
import Image from "next/image";
import "react-multi-carousel/lib/styles.css";
import {GoogleSignInButton,SignOutButton} from "../../components/GoogleSignIn"
import {GoogleOAuthProvider} from "@react-oauth/google"
import { useRouter } from 'next/navigation';
import WeatherWidget from "@/components/WeatherAPI";
import ClockWidget from "@/components/DigitalClock";

const customStyles = {
  orderButton: {
    backgroundColor: '#ffd700',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px'
  },
  arrowButton: {
    color: '#fff',
    cursor: 'pointer',
    fontSize: '24px',
    padding: '10px',
    borderRadius: '50%',
    background: 'none', 
    zIndex: 100
  },
  carouselBackground: {
    backgroundColor: 'maroon',
  }
};

const ArrowLeft = ({ onClick }) => (
  <div onClick={onClick} style={{ ...customStyles.arrowButton, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
    &lt;
  </div>
);

const ArrowRight = ({ onClick }) => (
  <div onClick={onClick} style={{ ...customStyles.arrowButton, position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
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
  let displayCategories;

  const handleWeatherLoaded = (temp) => {
    setTemperature(temp);
  };

  const handleOrder = (item) => {
    updateTransaction({
      id: item.id,
      itemname: item.name,
      price: item.price,
      quantity: 1
    });
  };

  if (temperature >= 70) {
      displayCategories = carouselColdCategories;
  } else {
      displayCategories = carouselHotCategories;
  }  
  const router = useRouter()


  return (
    <GoogleOAuthProvider clientId={googleClientID}>
      <main className="min-h-screen bg-cream flex flex-col items-center">
        <div className="flex items-center justify-center space-x-4 mt-5">
          <WeatherWidget onWeatherLoaded={handleWeatherLoaded} />
          <ClockWidget />
        </div>
        <div className='mt-5 flex flex-col space-y-2 ml-auto right-0'><GoogleSignInButton/><SignOutButton/></div>
        <Carousel
          swipeable
          draggable
          showDots
          responsive={responsive}
          ssr
          infinite
          autoPlay
          autoPlaySpeed={4000}
          keyBoardControl
          customTransition="all .5s ease-in-out"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px w-full"
          customLeftArrow={<ArrowLeft />}
          customRightArrow={<ArrowRight />}
          className="w-full relative"
        >
          {displayCategories.map((category, index) => (
            <div key={index} className="carousel-item" style={customStyles.carouselBackground}>
              <div className="container flex flex-wrap justify-center">
                <div className="w-full sm:w-1/2 p-4">
                  <img src={category.image} alt={category.phrase} className="carousel-image max-h-64 w-auto mx-auto" />
                </div>
                <div className="w-full sm:w-1/2 p-4">
                  <div className="carousel-content text-white">
                    <h3 className="text-xl font-bold mb-2">{category.phrase}</h3>
                    <p>{category.description}</p>
                    <button style={customStyles.orderButton} onClick={() => handleOrder(category)}>Order Now</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
        <div className="container px-10 mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buttonCategories.map((category) => (
            <Link key={category.phrase} href={category.path}>
              <div className="m-4 cursor-pointer aspect-square">
                <div className="overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                  <Image className="flex w-full rounded-lg" src={`${category.image}`} alt={category.name} width = {1500} height = {500}/>
                  <div className="flex py-4 rounded-lg text-center bg-white">
                    <span className="block text-lg font-semibold text-gray-800">
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
    </GoogleOAuthProvider>
  );
};

export default Home;
