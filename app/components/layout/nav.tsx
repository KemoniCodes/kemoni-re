"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.svg";

export default function Nav() {
  const pathname = usePathname();

  /* when link is active make it casperwhite when inactive make it shadowgrey on all pages except the home page */

  return (
    <nav className='nav flex justify-between items-center sticky top-0 pt-5'>
      <div className='logo'>
        <Link href={"/"}>
          <Image src={Logo} width={150} height={37} alt='logo' />
        </Link>
      </div>
      <ul className='flex gap-8'>
        <li>
          <Link
            className={`${pathname === "/" ? "" : pathname === "/about" ? "active" : "inactive"}`}
            href='/about'
          >
            about
          </Link>
        </li>
        <li>
          <Link
            className={`text-casperWhite ${pathname === "/" ? "" : pathname === "/properties" ? "active" : "inactive"}`}
            href='/properties'
          >
            properties
          </Link>
        </li>
        <li>
          <Link
            className={`text-casperWhite ${pathname === "/" ? "" : pathname === "/neighborhoods" ? "active" : "inactive"}`}
            href='/neighborhoods'
          >
            neighborhoods
          </Link>
        </li>
        <li>
          <Link
            className={`text-casperWhite ${pathname === "/" ? "" : pathname === "/contact" ? "active" : "inactive"}`}
            href='/contact'
          >
            contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
