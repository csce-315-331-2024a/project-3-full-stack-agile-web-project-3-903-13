"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaWindowClose } from "react-icons/fa";
import { useRef } from "react";
import GoogleTranslateWidget from "@/components/GoogleTranslate";

export default function CustomerNavbar({ links }) {
  const pathname = usePathname();
  const toggleCart = ()=>{
      if (ref.current.classList.contains('translate-x-full')) {
        ref.current.classList.remove('translate-x-full')
        ref.current.classList.add('translate-x-0')
      }
      else if (!ref.current.classList.contains('translate-x-full')) {
        ref.current.classList.remove('translate-x-0')
        ref.current.classList.add('translate-x-full')
      }
  }
  const ref = useRef()
  return (
    <nav className="flex w-full h-[5rem] bg-white shadow-md">
      <div className="flex w-full h-full justify-between items-center px-6 font-bold [&>*>li]:relative">
        <ul className="flex flex-row gap-8 items-center">
          <li>
              <Image src={"./logo.svg"} width={24} height={24}></Image>
          </li>
          {links.map((link) => (
            <li key={link.route}>
              <Link
                className={
                  pathname === link.route ? "nav-link-active" : "nav-link"
                }
                href={link.route}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-row gap-8 items-center">
          <GoogleTranslateWidget />
          <li>
            <Link href={"/employee/burgers"}>
              <Image className="nav-image" src={"./user.svg"} width={24} height={24}></Image>
            </Link>
          </li>
          {/* <li>
            <Link href={"/cart"}>
              <Image className="nav-image" src={"./cart.svg"} width={24} height={24}></Image>
            </Link>
          </li> */}
          <div onClick={toggleCart} className="cart">
              <Image className="nav-image" src={"./cart.svg"} width={24} height={24}></Image>
          </div>
        </ul>

        <div ref={ref} className="sideCart absolute top-0 right-0 bg-pink-100 p-10 transform transition-transform translate-x-full">
          <h2 className = 'font-bold text-xl'>Shopping Cart</h2>
          <span onClick = {toggleCart} className = "absolute top-2 right-2 text-2xl"><FaWindowClose /></span>
          <ol>
            <li>
              <span> Tshirt-Wear the code</span>
            </li>
          </ol>
        </div>
      </div>
    </nav>
  );
}
