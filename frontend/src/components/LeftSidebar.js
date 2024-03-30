"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function LeftSidebar({ links }) {
  const pathname = usePathname();
  return (
    <nav className="w-20 h-screen bg-white border-r-2 flex flex-col items-center gap-6 my-6">
      <Image src={"/logo.svg"} width={24} height={24}></Image>
      <Link href="/employee/burgers">Home</Link>
      <Link href="/employee/manager">Manager</Link>
    </nav>
  );
}
