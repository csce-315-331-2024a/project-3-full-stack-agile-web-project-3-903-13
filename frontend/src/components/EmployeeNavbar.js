"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import GoogleTranslateWidget from "@/components/GoogleTranslate";
import { useState } from "react";

export default function EmployeeNavbar({ links }) {
  const [isOpen, setOpen] = useState(false);

  const menuToggle = () => {
    setOpen(!isOpen);
  };

  const pathname = usePathname();

  return (
    <nav className="flex w-full h-[5rem] bg-white shadow-md">
      <div className="flex w-full h-full justify-between items-center px-6 font-bold [&>*>li]:relative">
        <div
          className="absolute right-[1.5rem] md:hidden group"
          onClick={menuToggle}
        >
          <div className="space-y-2">
            <span
              className={`block h-1 w-8 bg-black rounded-full transition-opacity ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <div className="relative">
              <span
                className={`block absolute h-1 w-8 bg-black rounded-full transition-transform duration-200 ease-in-out origin-center ${
                  isOpen ? "rotate-45" : ""
                }`}
              ></span>
              <span
                className={`block h-1 w-8 bg-black transition-transform duration-200 ease-in-out rounded-full origin-center ${
                  isOpen ? "-rotate-45" : ""
                }`}
              ></span>
            </div>
            <span
              className={`block h-1 w-8 bg-black rounded-full transition-opacity ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
          </div>
        </div>

        <ul
          className={`${
            isOpen ? "block bg-white border shadow mr-1" : "hidden"
          } absolute rounded-xl md:shadow-none md:bg-none md:border-0 md:relative right-0 md:mt-0 p-4 md:p-0 md:flex space-y-6 md:space-y-0 md:space-x-8 text-sm md:text-base`}
          style={{ marginTop: isOpen ? `${links.length * 3 + 1}rem` : "0rem" }}
          >
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
        <GoogleTranslateWidget />
      </div>
    </nav>
  );
}
