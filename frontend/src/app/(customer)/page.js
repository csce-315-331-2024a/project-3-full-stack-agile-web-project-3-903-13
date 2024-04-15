"use client";

import React from "react";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {GoogleSignInButton,SignOutButton} from "../../components/GoogleSignIn"
import {GoogleOAuthProvider} from "@react-oauth/google"
import { useRouter } from 'next/navigation';
import WeatherWidget from "@/components/WeatherAPI";

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        display: "block",
        fontSize: "36px",
        lineHeight: "60px",
        height: "60px",
        color: "black",
        right: "-30px",
      }}
      onClick={onClick}
    >
      &gt;
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className}`}
      style={{
        ...style,
        display: "block",
        fontSize: "36px",
        lineHeight: "60px",
        height: "60px",
        color: "black",
        left: "-30px",
      }}
      onClick={onClick}
    >
      &lt;
    </div>
  );
}

const googleClientID = '821375678963-ors2l4rh0gpqqlmq3p8ddg9pptv5fsqi.apps.googleusercontent.com'
const buttonCategories = [
  { name: "Burgers", path: "/Burgers", image: "/menuItems/ClassicHamburger.jpeg" },
  {
    name: "Hotdogs/Corndogs",
    path: "/Dogs",
    image: "/menuItems/2corndogvaluemeal.jpeg",
  },
  {
    name: "Chicken Tenders",
    path: "/Tenders",
    image: "/menuItems/3tenderentree.jpeg",
  },
  { name: "Sides", path: "/Sides", image: "/menuItems/ClassicHamburger.jpeg" },
  { name: "Shakes", path: "/Desserts", image: "/menuItems/ClassicHamburger.jpeg" },
  { name: "Beverages", path: "/Beverages", image: "/menuItems/ClassicHamburger.jpeg" },
  { name: "Seasonal", path: "/Seasonal", image: "/menuItems/ClassicHamburger.jpeg" },
];

const carouselCategories = [
  {
    name: "Order the classic hamburger today!",
    description:
      "Cheese, Lettuce, Tomatoes, Onions, and our signature patty all on artisan bread. Handcrafted with love by Rev's Grill!",
    image: "/menuItems/ClassicHamburger.jpeg",
  },
  {
    name: "Try the all new Gig Em Patty Melt!",
    description:
      "This revolutionary sandwich will turn even the staunchest of 2%ers into redasses in no time!",
    image: "/menuItems/GigEmPattyMelt.jpeg",
  },
];

const Home = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const router = useRouter()

  return (
    <GoogleOAuthProvider clientId={googleClientID}>
      <main className="min-h-screen bg-cream flex flex-col items-center">
      <WeatherWidget />
        <div className='mt-5 flex flex-col space-y-2 ml-auto right-0'><GoogleSignInButton/><SignOutButton/></div>
          <Slider {...settings} className="w-full max-w-screen-lg px-4 py-2">
              {carouselCategories.map((category, index) => (
                  <div key={index} className="carousel-item">
                      <div className="container flex flex-wrap justify-center">
                          <div className="w-full sm:w-1/2 p-4">
                              <img src={category.image} alt={category.name} className="carousel-image max-h-64 w-auto mx-auto" />
                          </div>
                          <div className="w-full sm:w-1/2 p-4">
                              <div className="carousel-content">
                                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                                  <p>{category.description}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </Slider>
          <div className="container px-10 mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buttonCategories.map((category) => (
            <Link key={category.name} href={category.path}>
              <div className="m-4 cursor-pointer aspect-square">
                <div className="overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
                  <img className="flex w-full rounded-lg" src={`${category.image}`} alt={category.name} />
                  <div className="flex py-4 rounded-lg text-center bg-white">
                    <span className="block text-lg font-semibold text-gray-800">
                      {category.name}
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
