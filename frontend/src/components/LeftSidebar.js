"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function LeftSidebar({ links }) {
  const pathname = usePathname();
  return (
    <>
    <nav className="w-[5rem] h-screen bg-white border-r-2 flex items-center flex-col">
      <Image src={"/revs.png"} alt="Rev's Grill Logo" width={0} height={0} sizes="100vw" className="w-full"></Image>
      <div className="flex flex-col items-center gap-8 pt-8">
      <Link href="/">
        <Image alt = "Home" src={"/home.svg"} width={24} height={24}></Image>
      </Link>
      <Link title="Place an Order" href="/employee/burgers">
        <Image alt = "Employee Point of Sale View" src={"/shop.svg"} width={24} height={24}></Image>
      </Link>
      <Link title="Manager Features" href="/employee/manager/inventory">
        <Image alt = "Manager Homepage" src={"/user.svg"} width={24} height={24}></Image>
      </Link>
      <Link title="User Management" href="/employee/manager/users">
        <Image alt = "User Management" src={"/users.svg"} width={24} height={24}></Image>
      </Link>
      <Link title="Sign Out" href="/user">
        <Image alt = "Sign Out" src={"/signout.svg"} width={24} height={24}></Image>
      </Link>
      </div>
    </nav>
    </>
  );
}
