"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function LeftSidebar({ links }) {
  const pathname = usePathname();
  return (
    <nav className="w-[5rem] h-screen bg-white border-r-2 flex flex-col items-center gap-8 py-6">
      <Link href="/">
        <Image alt = "rev logo" src={"/revs.png"} width={60} height={60}></Image>
      </Link>
      <Link href="/employee/burgers">
        <Image alt = "employee pos view" src={"/home.svg"} width={24} height={24}></Image>
      </Link>
      <Link href="/employee/manager/inventory">
        <Image alt = "manager home" src={"/user.svg"} width={24} height={24}></Image>
      </Link>
    </nav>
  );
}
