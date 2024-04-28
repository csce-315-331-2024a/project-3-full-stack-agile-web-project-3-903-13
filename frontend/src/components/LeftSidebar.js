"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function LeftSidebar({  }) {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;
  const links = [
    { href: "/employee/burgers", title: "Place an Order", imgSrc: "/shop.svg", imgAlt: "Point of Sale" },
    { href: "/employee/manager/inventory", title: "Manager Features", imgSrc: "/user.svg", imgAlt: "Manager" },
    { href: "/employee/manager/users", title: "User Management", imgSrc: "/users.svg", imgAlt: "Users" },
    { href: "/", title: "Return to Customer View", imgSrc: "/home.svg", imgAlt: "Home" },
    { href: "/user", title: "Sign Out", imgSrc: "/signout.svg", imgAlt: "Sign Out" }
  ];

  return (
    <nav className="fixed md:relative left-[calc(20%/2)] md:left-0 bottom-2 md:bottom-0 z-[9999] md:z-auto w-4/5 md:w-[5rem] h-[5rem] md:h-[calc(100vh+5rem)] flex flex-row md:flex-col items-center justify-center md:justify-normal bg-white border-2 md:border-l-0 md:border-r-2 border-gray-200 shadow-2xl md:shadow-none rounded-xl md:rounded-none px-2 md:px-0">
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
