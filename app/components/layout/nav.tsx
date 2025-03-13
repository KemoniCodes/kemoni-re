"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.svg";
import { ChevronDown, Search } from "lucide-react";
import TextBorderAnimation from "../animata/text/text-border-animation";
import { useTransitionRouterWithEffect } from "../../utils/pageTransition";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const pathname = usePathname();
  const navigateWithTransition = useTransitionRouterWithEffect();

  return (
    <motion.nav
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{
        default: { type: "spring", stiffness: 70 },
        // stiffness: { "100"},
        opacity: { ease: "linear" },
      }}
      // transition={{ type: "tween", ease: "easeIn"}}
      className='nav z-10 flex justify-between items-center sticky top-0 pt-5'
    >
      <div className='logo'>
        <Link href={"/"} onClick={(e) => navigateWithTransition("/", e)}>
          <Image src={Logo} width={150} height={37} alt='logo' />
        </Link>
      </div>
      <ul className='flex gap-5 items-end'>
        <div
          className={
            searchOpen
              ? "leftSection flex gap-5 -translate-x-[12rem] transform transition-transform duration-300 items-end"
              : "leftSection flex gap-5 items-end"
          }
        >
          <li className='-mr-1'>
            <Link
              className={`${pathname === "/" ? "" : pathname === "/for-buyers" ? "active" : "inactive"} flex items-center`}
              href='/for-buyers'
              onClick={(e) => navigateWithTransition("/for-buyers", e)}
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
              onClick={(e) => navigateWithTransition("/for-sellers", e)}
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
                    onClick={(e) =>
                      navigateWithTransition(
                        "/properties/exclusive-listings",
                        e
                      )
                    }
                  >
                    Exclusive Listings
                  </Link>
                </li>
                <li>
                  <Link
                    href='/properties/featured-leases'
                    className='block px-4 py-2 text-casperWhite hover:bg-casperWhite hover:text-offBlack'
                    onClick={(e) =>
                      navigateWithTransition("/properties/featured-leases", e)
                    }
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
              onClick={(e) => navigateWithTransition("/neighborhoods", e)}
            >
              <TextBorderAnimation text='neighborhoods' />
            </Link>
          </li>
          <li>
            <Link
              className={`${pathname === "/" ? "" : pathname === "/about" ? "active" : "inactive"}`}
              href='/about'
              onClick={(e) => navigateWithTransition("/about", e)}
            >
              <TextBorderAnimation text='about' />
            </Link>
          </li>
          <li>
            <Link
              className={`text-casperWhite ${pathname === "/" ? "" : pathname.includes("/musings") ? "active" : "inactive"}`}
              href='/musings'
              onClick={(e) => navigateWithTransition("/musings", e)}
            >
              <TextBorderAnimation text='musings' />
            </Link>
          </li>
          <li>
            <Link
              className={`text-casperWhite ${pathname === "/" ? "" : pathname === "/contact" ? "active" : "inactive"}`}
              href='/contact'
              onClick={(e) => navigateWithTransition("/contact", e)}
            >
              <TextBorderAnimation text='contact' />
            </Link>
          </li>
        </div>
        <div className='span searchSection ml-6'>
          <li className='search hover:cursor-pointer'>
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: searchOpen ? -200 : 0 }}
              transition={{ type: "spring", stiffness: 125, damping: 18 }}
              className={"divOpen relative flex items-center"}
            >
              {/* Search Icon */}
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 125, damping: 18 }}
                onClick={() => setSearchOpen(!searchOpen)}
                className={"cursor-pointer"}
              >
                <Search
                  className='text-casperWhite h-[1.4rem]'
                  strokeWidth={1.8}
                />
              </motion.div>

              {/* Search Input Field */}
              {searchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{
                    duration: 0.1,
                    ease: "easeInOut",
                    stiffness: 75,
                  }}
                  className='absolute left-6'
                >
                  <input
                    type='text'
                    placeholder='Search...'
                    className='bg-transparent border-b border-casperWhite outline-none text-casperWhite placeholder-casperWhite w-full pt-0 ml-3'
                    autoFocus
                  />
                </motion.div>
              )}
            </motion.div>
          </li>
        </div>
      </ul>
    </motion.nav>
  );
}
