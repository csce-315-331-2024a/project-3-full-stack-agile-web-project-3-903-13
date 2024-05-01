/**
 * @module LeftSidebar
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Component for displaying a navigation sidebar.
 * @function
 * @memberOf module:LeftSidebar
 * @param {Object} props - Component props.
 * @returns {React.Component} A React component that renders a sidebar with navigation links.
 */
export default function LeftSidebar({  }) {
    /**
   * Hook to get the current pathname from the URL using Next.js navigation API.
   * @memberOf module:LeftSidebar
   */
  const pathname = usePathname();

  /**
   * Determines if a navigation link is active based on the current pathname.
   * @function
   * @memberOf module:LeftSidebar
   * @param {string} href - The href of the navigation link to compare against the current pathname.
   * @returns {boolean} - True if the link is active, false otherwise.
   */
  const isActive = (href) => {
    if (href === "/employee/burgers") {
      return pathname.startsWith("/employee/") && !pathname.startsWith("/employee/manager");
    }
    else if (href === "/employee/manager/users") {
      return pathname === "/employee/manager/users";
    }
    else if (href === "/employee/manager/users") {
      return pathname.startsWith("/employee/manager/users");
    }
    return pathname === href;
  };

  // Array of link objects used for rendering navigation links
  const links = [
    { href: "/employee/burgers", title: "Place an Order", imgSrc: "/shop.svg", imgAlt: "Point of Sale" },
    { href: "/employee/manager/kitchen", title: "Kitchen", imgSrc: "/kitchen.svg", imgAlt: "Kitchen" },
    { href: "/employee/manager/inventory", title: "Manager Features", imgSrc: "/user.svg", imgAlt: "Manager" },
    { href: "/employee/manager/users", title: "User Management", imgSrc: "/users.svg", imgAlt: "Users" },
    { href: "/", title: "Return to Customer View", imgSrc: "/home.svg", imgAlt: "Home" },
    { href: "/user", title: "Sign Out", imgSrc: "/signout.svg", imgAlt: "Sign Out" }
  ];

  /**
   * Hook to set the sidebar height based on the window size.
   * @memberOf module:LeftSidebar
   */
  useEffect(() => {
    /**
     * Handles resizing the sidebar when the window size changes.
     * @memberOf module:LeftSidebar
     */
    function handleResize() {
      if (window.innerWidth >= 768) {
        setPageHeight(`${document.documentElement.scrollHeight}px`);
      } else {
        setPageHeight(`5rem`);
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []); 

  const [pageHeight, setPageHeight] = useState('100vh'); // Default height

  /**
   * Hook to set the initial height of the sidebar based on the document height.
   * @memberOf module:LeftSidebar
   */
  useEffect(() => {
    const height = `${document.documentElement.scrollHeight}px`;
    setPageHeight(height);
  }, []);

  return (
    <nav className={`fixed md:relative left-[calc(20%/2)] md:left-0 bottom-2 md:bottom-0 z-[9999] md:z-auto w-4/5 md:w-[5rem] h-${pageHeight} flex flex-row md:flex-col items-center justify-center md:justify-normal bg-white border-2 md:border-y-0 md:border-l-0 md:border-r-2 border-gray-200 shadow-2xl md:shadow-none rounded-xl md:rounded-none px-2 md:px-0`}>
      <Image src={"/revs.png"} alt="Rev's Grill Logo" width={0} height={0} sizes="100vw" className="hidden md:flex w-full"></Image>
      <div className="flex flex-row md:flex-col items-center md:pt-5">
      {links.map(link => (
        <Link className={`${isActive(link.href) ? "left-sidebar-link-active" : "left-sidebar-link"}`} key={link.href} href={link.href} title={link.title}>
            <Image src={link.imgSrc} alt={link.imgAlt} width={24} height={24} />
        </Link>
      ))}
      </div>
    </nav>
  );
}
