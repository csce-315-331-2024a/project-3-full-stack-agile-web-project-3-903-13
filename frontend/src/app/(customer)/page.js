"use client";

import React from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GoogleSignInButton from "../../components/GoogleSignIn"
import {GoogleOAuthProvider} from "@react-oauth/google"
import { useRouter } from 'next/navigation';

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
              right: "-30px"
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
              left: "-30px"
          }}
          onClick={onClick}
      >
          &lt;
      </div>
  );
}

const googleClientID = '821375678963-ors2l4rh0gpqqlmq3p8ddg9pptv5fsqi.apps.googleusercontent.com'
const buttonCategories = [
  { name: "Burgers", path: "/burgers", image: "/images/burgers.png" },
  { name: "Hotdogs/Corndogs", path: "/hotdogs", image: "/images/hotdogs-corndogs.jpg" },
  { name: "Chicken Tenders", path: "/tenders", image: "/images/chicken-tenders.jpg" },
  { name: "Sides", path: "/fries", image: "/images/sides.jpg" },
  { name: "Shakes", path: "/shakes", image: "/images/shakes.jpg" },
  { name: "Beverages", path: "/beverages", image: "/images/beverages.jpg" },
  { name: "Seasonal", path: "/seasonal", image: "/images/seasonal.jpg" }
];

const carouselCategories = [
  {
      name: 'TEST NAME THIS IS BASIC THING',
      description: 'YAY IT WORKS',
      image: '/logo.svg'
  },
  {
      name: 'ANOTHER TEST',
      description: 'DOES IT WORK IF YOU SEE THIS YES.',
      image: '/testPicture.svg'
  }
];

const Home = () => {
  var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
  };

  const router = useRouter()

  return (
    <GoogleOAuthProvider clientId={googleClientID}>
      <main className="min-h-screen bg-cream flex flex-col items-center">
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
          <div className="button-container fixed bottom-0 left-0 right-0 z-10 flex justify-center items-center bg-white">
            <GoogleSignInButton/>
              {buttonCategories.map(category => (
                  <Link key={category.name} href={category.path}>
                      <div className="m-4 cursor-pointer">
                          <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                              <img src={category.image} alt={category.name} className="w-full h-auto max-h-20" />
                              <div className="py-4 text-center bg-white">
                                  <span className="block text-lg font-semibold text-gray-800">{category.name}</span>
                              </div>
                          </div>
                      </div>
                  </Link>
              ))}
          </div>
      </main>
    </GoogleOAuthProvider>
  );
};

export default Home;
