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
    <nav className="w-[5rem] h-screen bg-white border-r-2 flex items-center flex-col">
      <Image src={"/revs.png"} alt="Rev's Grill Logo" width={0} height={0} sizes="100vw" className="w-full"></Image>
      <div className="flex flex-col items-center pt-5">
      {links.map(link => (
        <Link className={`${isActive(link.href) ? "left-sidebar-link-active" : "left-sidebar-link"}`} key={link.href} href={link.href} title={link.title}>
            <Image src={link.imgSrc} alt={link.imgAlt} width={24} height={24} />
        </Link>
      ))}
      </div>
    </nav>
  );
}
