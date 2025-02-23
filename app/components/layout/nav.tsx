"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.svg";
import { ChevronDown, Search } from "lucide-react";
import TextBorderAnimation from "../animata/text/text-border-animation";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{
        default: { type: "spring", stiffness: 100 },
        // stiffness: { "100"},
        opacity: { ease: "linear" },
      }}
      // transition={{ type: "tween", ease: "easeIn"}}
      className='nav z-10 flex justify-between items-center sticky top-0 pt-5'
    >
      <div className='logo'>
        <Link href={"/"}>
          <Image src={Logo} width={150} height={37} alt='logo' />
        </Link>
      </div>
      <ul className='flex gap-5 items-end'>
        <li className='-mr-1'>
          <Link
            className={`${pathname === "/" ? "" : pathname === "/for-buyers" ? "active" : "inactive"} flex items-center`}
            href='/for-buyers'
          >
            <TextBorderAnimation text='for buyers' />
            <span className='pl-[.1rem]'>
              <ChevronDown
                strokeWidth={1}
                className='text-casperWhite h-[1.2rem] w-auto'
              />
            </span>
          </Link>
        </li>
        <li className='-mr-1'>
          <Link
            className={`${pathname === "/" ? "" : pathname === "/for-sellers" ? "active" : "inactive"} flex items-center`}
            href='/for-sellers'
          >
            <TextBorderAnimation text='for sellers' />
            <span className='pl-[.1rem]'>
              <ChevronDown
                strokeWidth={1}
                className='text-casperWhite h-[1.2rem] w-auto'
              />
            </span>
          </Link>
        </li>
        <li className='relative -mr-1'>
          <button
            className={`flex items-center !border-0 text-casperWhite ${
              pathname === "/"
                ? ""
                : pathname.includes("/properties")
                  ? "active"
                  : "inactive"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <TextBorderAnimation text='properties' />
            <span className='pl-[.1rem]'>
              <ChevronDown
                strokeWidth={1}
                className={`text-casperWhite h-[1.2rem] w-auto transition-transform duration-500 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </button>

          {isOpen && (
            <ul className='absolute left-0 mt-2 w-40 bg-offBlack rounded-lg overflow-hidden z-50'>
              <li>
                <Link
                  href='/properties/exclusive-listings'
                  className='block px-4 py-2 text-casperWhite hover:bg-casperWhite hover:text-offBlack'
                >
                  Exclusive Listings
                </Link>
              </li>
              <li>
                <Link
                  href='/properties/featured-leases'
                  className='block px-4 py-2 text-casperWhite hover:bg-casperWhite hover:text-offBlack'
                >
                  featured leases
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li>
          <Link
            className={`text-casperWhite ${pathname === "/" ? "" : pathname.includes("/neighborhoods") ? "active" : "inactive"}`}
            href='/neighborhoods'
          >
            <TextBorderAnimation text='neighborhoods' />
          </Link>
        </li>
        <li>
          <Link
            className={`${pathname === "/" ? "" : pathname === "/about" ? "active" : "inactive"}`}
            href='/about'
          >
            <TextBorderAnimation text='about' />
          </Link>
        </li>
        <li>
          <Link
            className={`text-casperWhite ${pathname === "/" ? "" : pathname.includes("/musings") ? "active" : "inactive"}`}
            href='/musings'
          >
            <TextBorderAnimation text='musings' />
          </Link>
        </li>
        <li>
          <Link
            className={`text-casperWhite ${pathname === "/" ? "" : pathname === "/contact" ? "active" : "inactive"}`}
            href='/contact'
          >
            <TextBorderAnimation text='contact' />
          </Link>
        </li>
        <div className='span searchSection ml-6'>
          <li className='search hover:cursor-pointer'>
            <Search className='text-casperWhite h-[1.4rem]' strokeWidth={1.8} />
          </li>
        </div>
      </ul>
    </motion.nav>
  );
}
