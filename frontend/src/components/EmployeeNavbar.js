/**
 * @module EmployeeNavbar
 */
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import GoogleTranslateWidget from "@/components/GoogleTranslate";
import { useState, useEffect } from "react";

/**
 * Component that provides a responsive navigation bar for employee-related interfaces.
 * This navigation bar includes dynamic links, a menu toggle for mobile views, and integrates the GoogleTranslateWidget for language translation.
 * The navigation state changes based on the screen size and user interactions, such as clicking the menu toggle in mobile view.
 *
 * @function EmployeeNavbar
 * @memberOf module:EmployeeNavbar
 * @param {Object[]} links - An array of objects representing the navigation links, where each object contains the `route` and `name` of the link.
 * @returns {React.Component} A React component that renders the employee navigation bar with support for dynamic resizing and toggle functionality.
 */
export default function EmployeeNavbar({ links }) {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  /**
   * Manages the toggle state of the mobile menu.
   * This function is invoked upon clicking the menu icon in mobile view, toggling the state between open and closed.
   * @memberOf module:EmployeeNavbar
   */
  const menuToggle = () => {
    setOpen(!isOpen);
  };

  /**
   * Sets up a responsive behavior for the navigation menu based on window size.
   * This effect ensures that the navigation menu is automatically closed when the window is resized to a width of 768px or wider.
   * It properly cleans up by removing the event listener when the component unmounts.
   * @memberOf module:EmployeeNavbar
   */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []); 

  /**
   * Determines if the current path includes 'manager' to adjust the style dynamically based on the user's role.
   * It logs whether the current user is a manager to the console for debugging purposes.
   * @memberOf module:EmployeeNavbar
   */
  const isManager = pathname.includes("manager");
  console.log(isManager);

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
          } absolute rounded-xl md:shadow-none md:bg-none md:border-0 md:relative right-0 md:mt-0 p-4 md:p-0 md:flex space-y-6 md:space-y-0 md:space-x-6`}
          style={{ marginTop: isOpen ? `${links.length * 3 + 2}rem` : "0rem", fontSize: isManager ? "13px" : "16px" }}
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
