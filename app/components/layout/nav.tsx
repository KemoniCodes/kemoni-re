"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.svg";
import VerticalLogo from "../../../public/verticalLogo.png";
import { ChevronDown, Search, X, Menu } from "lucide-react";
import TextBorderAnimation from "../animata/text/text-border-animation";
import { useTransitionRouterWithEffect } from "../../utils/pageTransition";
import {
  Modal,
  ModalContent,
  ModalBody,
  //   Button,
  useDisclosure,
} from "@heroui/react";
import WorkWithMe from "../home/workWithMe";
import {
  getForSaleProperties,
  getForLeaseProperties,
  getBlog,
} from "@/sanity/sanity.query";
import { Properties, Blog } from "@/sanity/types";
import { urlFor } from "@/app/utils/imageUrl";

export default function Nav() {
  const [menuIsOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any>({
    properties: [],
    leases: [],
    blogs: [],
  });
  // const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isContactOpen,
    onOpen: onContactOpen,
    onClose: onContactClose,
    onOpenChange: onContactOpenChange,
  } = useDisclosure();

  const {
    isOpen: isSearchModalOpen,
    onOpen: onSearchModalOpen,
    onClose: onSearchModalClose,
    onOpenChange: onSearchModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isMobileSearchModalOpen,
    onOpen: onMobileSearchModalOpen,
    onClose: onMobileSearchModalClose,
    onOpenChange: onMobileSearchModalOpenChange,
  } = useDisclosure();

  const [size, setSize] = React.useState("full");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [propertiesData, setPropertiesData] = useState<Properties | null>(null);
  const [leaseData, setLeaseData] = useState<Properties | null>(null);
  const [blogData, setBlogData] = useState<Blog | null>(null);

  const linkHandleOpen = (size: React.SetStateAction<string>) => {
    setSize(size);
    onContactOpen();
  };

  const searchModalOpen = (size: React.SetStateAction<string>) => {
    setSize(size);
    onSearchModalOpen();
  };

  const mobileSearchModalOpen = (size: React.SetStateAction<string>) => {
    setSize(size);
    onMobileSearchModalOpen();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const blogData = await getBlog();
        setBlogData(blogData);
        const propertiesData = await getForSaleProperties();
        setPropertiesData(propertiesData);
        const leaseData = await getForLeaseProperties();
        setLeaseData(leaseData);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResults({ properties: [], leases: [], blogs: [] });
      return;
    }

    const query = searchQuery.toLowerCase().trim();

    const filterListings = (data: Properties | null) =>
      data?.property?.filter((listing) => {
        const fullAddress =
          `${listing.address?.line1} ${listing.address?.line2}`.toLowerCase();
        const area = listing.area?.replace("-", " ").toLowerCase();

        return fullAddress.includes(query) || area?.includes(query);
      }) || [];

    const filteredProperties = filterListings(propertiesData);
    const filteredLeases = filterListings(leaseData);

    const filteredBlogs =
      blogData?.articles?.filter((post) =>
        post?.articleTitle?.toLowerCase().includes(query)
      ) || [];

    setSearchResults({
      properties: filteredProperties,
      leases: filteredLeases,
      blogs: filteredBlogs,
    });
  }, [searchQuery, propertiesData, leaseData, blogData]);

  const pathname = usePathname();
  const navigateWithTransition = useTransitionRouterWithEffect();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

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
      <div className='mobileMenu lg:hidden block w-full'>
        <div className='mobileMenuHeader pb-8 pt-4 lg:hidden flex w-full relative z-50'>
          {/* {mobileMenuOpen ? null : ( */}
          <div className='logo'>
            <Link href={"/"} onClick={(e) => navigateWithTransition("/", e)}>
              <Image src={Logo} width={150} height={37} alt='logo' />
            </Link>
          </div>
          {/* )} */}

          <button
            className='lg:hidden text-casperWhite flex w-full justify-end border-0'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120 }}
            className='lg:hidden bg-offBlack text-casperWhite flex flex-col gap-6 p-8 z-40 w-screen -ml-8 !h-screen absolute -top-8 pt-48'
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
                className={`flex items-center pl-0 !border-0 text-casperWhite 
                  ${
                    pathname === "/"
                      ? ""
                      : pathname.includes("/properties")
                        ? "active"
                        : "inactive"
                  }`}
                onClick={() => setIsOpen(!menuIsOpen)}
              >
                <TextBorderAnimation text='properties' />
                <span className='pl-[.1rem]'>
                  <ChevronDown
                    strokeWidth={1}
                    className={`text-casperWhite h-[1.2rem] w-auto transition-transform duration-500 ${
                      menuIsOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {menuIsOpen && (
                <ul className='absolute left-0 mt-2 w-40 bg-offBlack rounded-lg overflow-hidden z-50'>
                  {[
                    {
                      href: "/properties/exclusive-listings",
                      label: "Exclusive Listings",
                    },
                    {
                      href: "/properties/curated-properties",
                      label: "Curated Properties",
                    },
                    {
                      href: "/properties/featured-leases",
                      label: "Featured Leases",
                    },
                    {
                      href: "/properties/recently-sold",
                      label: "Recently Sold",
                    },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className='block px-4 py-2 text-casperWhite hover:bg-casperWhite hover:text-offBlack'
                        onClick={(e) => {
                          navigateWithTransition(href, e);
                          setIsOpen(false); // Close the menu on click
                        }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
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
                className={`text-casperWhite ${pathname === "/" ? "" : pathname.includes("/blog") ? "active" : "inactive"}`}
                href='/blog'
                onClick={(e) => navigateWithTransition("/blog", e)}
              >
                <TextBorderAnimation text='blog' />
              </Link>
            </li>
            <li>
              <Link
                className={`text-casperWhite cursor-pointer ${pathname === "/" ? "" : pathname === "/contact" ? "active" : "inactive"}`}
                href=''
                // target="#"
                onClick={() => {
                  linkHandleOpen(size);
                }}
              >
                <TextBorderAnimation text='contact' />
              </Link>
              <Modal
                isOpen={isContactOpen}
                onClose={onContactClose}
                scrollBehavior={"outside"}
                onOpenChange={onContactOpenChange}
                size={"full"}
              >
                <ModalContent className=''>
                  {() => (
                    <>
                      <ModalBody>
                        <div className='row flex contactModal'>
                          <div
                            className='left w-[60%] h-screen'
                            style={{
                              backgroundImage: "url('/nhImg.png')",
                            }}
                          >
                            <div className='absolute inset-0 bg-black opacity-60' />
                            <div className='agentInfo absolute flex flex-col w-[60%] items-center pt-16'>
                              <Image
                                src={VerticalLogo}
                                width={334}
                                height={173.91}
                                alt='logo'
                                className='w-[15vw] mb-20'
                              />
                              <div className='bg-shadowGrey w-[238px] h-[258px]'></div>
                              <ul className='flex list-none gap-5 mt-16'>
                                <li>
                                  <h3 className='normal-case '>
                                    Kemoni Williams
                                  </h3>
                                  <p className=' text-shadowGrey text-[16px]'>
                                    real estate specialist
                                  </p>
                                </li>
                                <li>
                                  <h3 className='normal-case '>
                                    <Link
                                      className=''
                                      //   href={
                                      //     "https://mail.google.com/mail/?view=cm&fs=1&to=kemoni@kemoniwilliams.com"
                                      //   }
                                      href={"mailto:kemoni@kemoniwilliams.com"}
                                      target='#'
                                    >
                                      kemoni@kemoniwilliams.com
                                    </Link>
                                  </h3>
                                  <p className=' text-shadowGrey text-[16px]'>
                                    email
                                  </p>
                                </li>
                                <li>
                                  <h3 className='normal-case '>
                                    <Link
                                      className=''
                                      href={"tel:310-962-1050"}
                                    >
                                      310-962-1050
                                    </Link>
                                  </h3>
                                  <p className=' text-shadowGrey text-[16px]'>
                                    phone
                                  </p>
                                </li>
                                <li>
                                  <h3 className='normal-case '>
                                    <Link className='' href=''>
                                      #02247870
                                    </Link>
                                  </h3>
                                  <p className=' text-shadowGrey text-[16px]'>
                                    ca dre
                                  </p>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className='right w-[40%] flex flex-col items-center relative py-16'>
                            <WorkWithMe />
                          </div>
                        </div>
                        {/* <div className='scheduleShowing'>
                    <div className='row flex'>
                      <div
                        className='img w-1/2 h-[90vh] bg-cover bg-center'
                        style={{
                          backgroundImage: ShowingImg
                            ? `url(${ShowingImg.src})`
                            : "none",
                        }}
                      />
                      <div className='showingSelector w-1/2 px-12 m-auto'>
                        <h2 className='text-center mb-6'>schedule a tour</h2>
                        <p className='text-center'>
                          I would love to give you a private tour of this
                          stunning property. Kindly select your preferred date
                          and time below, and I&apos;ll be in touch promptly to
                          confirm your appointment.
                        </p>
                      </div>
                    </div>
                  </div> */}
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </li>
            <li className='search hover:cursor-pointer mt-16'>
              <div className={"divOpen relative flex items-center w-full"}>
                {/* Search Icon */}
                {/* <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  transition={{ type: "spring", stiffness: 125, damping: 18 }}
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={"cursor-pointer"}
                > */}
                <Search
                  className='text-casperWhite h-[1.4rem]'
                  strokeWidth={1.8}
                />
                {/* </motion.div> */}

                {/* Search Input Field */}
                {/* {searchOpen && ( */}
                <div className='absolute left-6 pr-8 w-full'>
                  <input
                    type='text'
                    placeholder='Search address, city, or blog...'
                    className='bg-transparent border-b border-casperWhite outline-none text-casperWhite placeholder-casperWhite w-full pt-0 ml-3 pb-[.2rem]'
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim() !== "") {
                        // setMobileSearchOpen(true);
                        mobileSearchModalOpen("sm");
                      }
                    }}
                  />
                </div>
                <Modal
                  isOpen={isMobileSearchModalOpen}
                  onClose={onMobileSearchModalClose}
                  scrollBehavior={"inside"}
                  onOpenChange={onMobileSearchModalOpenChange}
                  size={"sm"}
                  placement='center'
                >
                  <ModalContent className='' data-lenis-prevent>
                    {() => (
                      <>
                        <div
                          className='searchResultsContainer bg-offBlack p-8
                     '
                        >
                          <h2 className='pt-8 text-center'>search results</h2>
                          <div className='results flex flex-col gap-16 mt-16'>
                            {searchResults.properties.length > 0 && (
                              <div className='forSaleSearchResults'>
                                <h2 className='pb-3 mb-8 border-b border-b-casperWhite'>
                                  For Sale
                                </h2>
                                <div className='grid grid-cols-1 gap-x-4 gap-y-8'>
                                  {searchResults.properties.map(
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    (listing: any, key: any) => (
                                      <Link
                                        key={key}
                                        href={`properties/exclusive-listings/${listing?.homeURL?.current}`}
                                        onClick={(e) =>
                                          navigateWithTransition(
                                            `properties/exclusive-listings/${listing?.homeURL?.current}`,
                                            e
                                          )
                                        }
                                      >
                                        <div className='row flex gap-x-4'>
                                          <Image
                                            src={urlFor(listing.homeThumbnail)
                                              .width(150)
                                              .height(150)
                                              .url()}
                                            alt={`${listing.homeThumbnail?.alt}`}
                                            width={150}
                                            height={150}
                                            className='rounded-lg w-full object-fill'
                                          />
                                          <div className='listingInfo '>
                                            <h3>
                                              <b>{listing.address?.line1},</b>
                                            </h3>
                                            <h3>
                                              <b>{listing.address?.line2}</b>
                                            </h3>
                                            <h3 className='mt-3'>
                                              ${listing.price}
                                            </h3>
                                            <div className='flex mt-[10px] text-shadowGrey items-center'>
                                              <h3 className='text-shadowGrey pr-2'>
                                                {listing?.bedrooms} BD
                                              </h3>
                                              |
                                              <h3 className='text-shadowGrey px-2'>
                                                {listing?.bathrooms} BA
                                              </h3>
                                              |
                                              <h3 className='text-shadowGrey pl-2'>
                                                {listing?.sqft} SQFT
                                              </h3>
                                            </div>
                                          </div>
                                        </div>
                                      </Link>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {searchResults.leases.length > 0 && (
                              <div className='forLeaseSearchResults'>
                                <h2 className='pb-3 mb-8 border-b border-b-casperWhite'>
                                  Featured Leases
                                </h2>
                                <div className='grid grid-cols-1 gap-x-4 gap-y-8'>
                                  {searchResults.leases.map(
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    (listing: any, key: any) => (
                                      <Link
                                        key={key}
                                        href={`properties/featured-leases/${listing?.homeURL?.current}`}
                                        onClick={(e) =>
                                          navigateWithTransition(
                                            `properties/featured-leases/${listing?.homeURL?.current}`,
                                            e
                                          )
                                        }
                                      >
                                        <div className='row flex gap-x-4'>
                                          <Image
                                            src={urlFor(listing.homeThumbnail)
                                              .width(150)
                                              .height(150)
                                              .url()}
                                            alt={`${listing.homeThumbnail?.alt}`}
                                            width={150}
                                            height={150}
                                            className='rounded-lg w-full object-fill'
                                          />
                                          <div className='listingInfo '>
                                            <h3>
                                              <b>{listing.address?.line1},</b>
                                            </h3>
                                            <h3>
                                              <b>{listing.address?.line2}</b>
                                            </h3>
                                            <h3 className='mt-3'>
                                              ${listing.price}
                                            </h3>
                                            <div className='flex mt-[10px] text-shadowGrey items-center'>
                                              <h3 className='text-shadowGrey pr-2'>
                                                {listing?.bedrooms} BD
                                              </h3>
                                              |
                                              <h3 className='text-shadowGrey px-2'>
                                                {listing?.bathrooms} BA
                                              </h3>
                                              |
                                              <h3 className='text-shadowGrey pl-2'>
                                                {listing?.sqft} SQFT
                                              </h3>
                                            </div>
                                          </div>
                                        </div>
                                      </Link>
                                    )
                                  )}
                                </div>
                              </div>
                            )}

                            {searchResults.blogs.length > 0 && (
                              <div className='blogPostResults'>
                                <h2 className='pb-3 mb-8 border-b border-b-casperWhite'>
                                  Blog Posts
                                </h2>
                                <div className='grid grid-cols-1 gap-x-4 gap-y-8'>
                                  {searchResults.blogs.map(
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    (post: any, key: any) => (
                                      <Link
                                        key={key}
                                        href={`/blog/${post?.articleTitle
                                          ?.toLowerCase()
                                          .replace(/[^a-z0-9]+/g, "-")
                                          .replace(/^-+|-+$/g, "")
                                          .slice(0, 200)}`}
                                        onClick={(e) =>
                                          navigateWithTransition(
                                            `/blog/${post?.articleTitle
                                              ?.toLowerCase()
                                              .replace(/[^a-z0-9]+/g, "-")
                                              .replace(/^-+|-+$/g, "")
                                              .slice(0, 200)}`,
                                            e
                                          )
                                        }
                                      >
                                        <div className='row flex gap-x-4 gap-y-4 flex-col'>
                                          <Image
                                            src={urlFor(post?.articleThumbnail)
                                              .width(150)
                                              .height(150)
                                              .url()}
                                            alt={`${post?.articleThumbnail?.alt}`}
                                            width={150}
                                            height={150}
                                            className='rounded-lg h-full w-full object-fill'
                                          />
                                          <div className='articleInfo'>
                                            <h5 className='date mb-1 font-bold'>
                                              {formatDate(
                                                post?.articleDate ?? ""
                                              )}
                                            </h5>
                                            <h3>{post?.articleTitle}</h3>
                                            <div className='filters flex gap-3 mt-4'>
                                              {post?.filters?.map(
                                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                                (filter: any, index: any) => (
                                                  <span
                                                    className='h3 blogFilter !w-fit'
                                                    key={index}
                                                  >
                                                    {filter}
                                                  </span>
                                                )
                                              )}
                                            </div>
                                            <p className='summary mt-6'>
                                              {post?.articleText
                                                ?.find(
                                                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                                  (paragraph: any) =>
                                                    paragraph.style === "normal"
                                                )
                                                ?.children?.[0]?.text?.split(
                                                  " "
                                                )
                                                ?.slice(0, 27)
                                                ?.join(" ") + "..."}
                                            </p>
                                          </div>
                                        </div>
                                      </Link>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </ModalContent>
                </Modal>
                {/* )} */}
              </div>
            </li>
          </motion.div>
        )}
      </div>
      <div className='desktopMenu lg:flex justify-between items-center hidden w-full'>
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
                onClick={() => setIsOpen(!menuIsOpen)}
              >
                <TextBorderAnimation text='properties' />
                <span className='pl-[.1rem]'>
                  <ChevronDown
                    strokeWidth={1}
                    className={`text-casperWhite h-[1.2rem] w-auto transition-transform duration-500 ${
                      menuIsOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {menuIsOpen && (
                <ul className='absolute left-0 mt-2 w-40 bg-offBlack rounded-lg overflow-hidden z-50'>
                  {[
                    {
                      href: "/properties/exclusive-listings",
                      label: "Exclusive Listings",
                    },
                    {
                      href: "/properties/curated-properties",
                      label: "Curated Properties",
                    },
                    {
                      href: "/properties/featured-leases",
                      label: "Featured Leases",
                    },
                    {
                      href: "/properties/recently-sold",
                      label: "Recently Sold",
                    },
                  ].map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className='block px-4 py-2 text-casperWhite hover:bg-casperWhite hover:text-offBlack'
                        onClick={(e) => {
                          navigateWithTransition(href, e);
                          setIsOpen(false); // Close the menu on click
                        }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
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
                className={`text-casperWhite ${pathname === "/" ? "" : pathname.includes("/blog") ? "active" : "inactive"}`}
                href='/blog'
                onClick={(e) => navigateWithTransition("/blog", e)}
              >
                <TextBorderAnimation text='blog' />
              </Link>
            </li>
            <li>
              <Link
                className={`text-casperWhite cursor-pointer ${pathname === "/" ? "" : pathname === "/contact" ? "active" : "inactive"}`}
                href=''
                // target="#"
                onClick={() => {
                  linkHandleOpen(size);
                }}
              >
                <TextBorderAnimation text='contact' />
              </Link>
              <Modal
                isOpen={isContactOpen}
                onClose={onContactClose}
                scrollBehavior={"outside"}
                onOpenChange={onContactOpenChange}
                size={"full"}
              >
                <ModalContent className=''>
                  {() => (
                    <>
                      <ModalBody>
                        <div className='row flex contactModal'>
                          <div
                            className='left w-[60%] h-screen'
                            style={{
                              backgroundImage: "url('/nhImg.png')",
                            }}
                          >
                            <div className='absolute inset-0 bg-black opacity-60' />
                            <div className='agentInfo absolute flex flex-col w-[60%] items-center pt-16'>
                              <Image
                                src={VerticalLogo}
                                width={334}
                                height={173.91}
                                alt='logo'
                                className='w-[15vw] mb-20'
                              />
                              <div className='bg-shadowGrey w-[238px] h-[258px]'></div>
                              <ul className='flex list-none gap-5 mt-16'>
                                <li>
                                  <h3 className='normal-case '>
                                    Kemoni Williams
                                  </h3>
                                  <p className=' text-shadowGrey text-[16px]'>
                                    real estate specialist
                                  </p>
                                </li>
                                <li>
                                  <h3 className='normal-case '>
                                    <Link
                                      className=''
                                      //   href={
                                      //     "https://mail.google.com/mail/?view=cm&fs=1&to=kemoni@kemoniwilliams.com"
                                      //   }
                                      href={"mailto:kemoni@kemoniwilliams.com"}
                                      target='#'
                                    >
                                      kemoni@kemoniwilliams.com
                                    </Link>
                                  </h3>
                                  <p className=' text-shadowGrey text-[16px]'>
                                    email
                                  </p>
                                </li>
                                <li>
                                  <h3 className='normal-case '>
                                    <Link
                                      className=''
                                      href={"tel:310-962-1050"}
                                    >
                                      310-962-1050
                                    </Link>
                                  </h3>
                                  <p className=' text-shadowGrey text-[16px]'>
                                    phone
                                  </p>
                                </li>
                                <li>
                                  <h3 className='normal-case '>
                                    <Link className='' href=''>
                                      #02247870
                                    </Link>
                                  </h3>
                                  <p className=' text-shadowGrey text-[16px]'>
                                    ca dre
                                  </p>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className='right w-[40%] flex flex-col items-center relative py-16'>
                            <WorkWithMe />
                          </div>
                        </div>
                        {/* <div className='scheduleShowing'>
                    <div className='row flex'>
                      <div
                        className='img w-1/2 h-[90vh] bg-cover bg-center'
                        style={{
                          backgroundImage: ShowingImg
                            ? `url(${ShowingImg.src})`
                            : "none",
                        }}
                      />
                      <div className='showingSelector w-1/2 px-12 m-auto'>
                        <h2 className='text-center mb-6'>schedule a tour</h2>
                        <p className='text-center'>
                          I would love to give you a private tour of this
                          stunning property. Kindly select your preferred date
                          and time below, and I&apos;ll be in touch promptly to
                          confirm your appointment.
                        </p>
                      </div>
                    </div>
                  </div> */}
                      </ModalBody>
                    </>
                  )}
                </ModalContent>
              </Modal>
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
                  onClick={() => {
                    setSearchOpen(!searchOpen);
                    // searchModalOpen(size);
                  }}
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
                      placeholder='Search address, city, or blog...'
                      className='bg-transparent border-b border-casperWhite outline-none text-casperWhite placeholder-casperWhite w-full pt-0 ml-3 pb-[.2rem]'
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && searchQuery.trim() !== "") {
                          setSearchOpen(true);
                          searchModalOpen("5xl");
                        }
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </li>
            {/* {searchOpen && searchOpen ? ( */}
            <Modal
              isOpen={isSearchModalOpen}
              onClose={onSearchModalClose}
              scrollBehavior={"inside"}
              onOpenChange={onSearchModalOpenChange}
              size={"5xl"}
            >
              <ModalContent className='' data-lenis-prevent>
                {() => (
                  <>
                    <div
                      className='searchResultsContainer bg-offBlack p-8
                     '
                    >
                      {/* <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className=' float-right justify-items-end border-0'
                      >
                        <X size={24} color='#f7f7ff' />
                      </button> */}
                      <h2 className='pt-8 text-center'>search results</h2>
                      <div className='results flex flex-col gap-16 mt-16'>
                        {searchResults.properties.length > 0 && (
                          <div className='forSaleSearchResults'>
                            <h2 className='pb-3 mb-8 border-b border-b-casperWhite'>
                              For Sale
                            </h2>
                            <div className='grid grid-cols-2 gap-x-4 gap-y-8'>
                              {searchResults.properties.map(
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                (listing: any, key: any) => (
                                  <Link
                                    key={key}
                                    href={`properties/exclusive-listings/${listing?.homeURL?.current}`}
                                    onClick={(e) =>
                                      navigateWithTransition(
                                        `properties/exclusive-listings/${listing?.homeURL?.current}`,
                                        e
                                      )
                                    }
                                  >
                                    <div className='row flex gap-x-4'>
                                      <Image
                                        src={urlFor(listing.homeThumbnail)
                                          .width(150)
                                          .height(150)
                                          .url()}
                                        alt={`${listing.homeThumbnail?.alt}`}
                                        width={150}
                                        height={150}
                                        className='rounded-lg'
                                      />
                                      <div className='listingInfo '>
                                        <h3>
                                          <b>{listing.address?.line1},</b>
                                        </h3>
                                        <h3>
                                          <b>{listing.address?.line2}</b>
                                        </h3>
                                        <h3 className='mt-3'>
                                          ${listing.price}
                                        </h3>
                                        <div className='flex mt-[10px] text-shadowGrey items-center'>
                                          <h3 className='text-shadowGrey pr-2'>
                                            {listing?.bedrooms} BD
                                          </h3>
                                          |
                                          <h3 className='text-shadowGrey px-2'>
                                            {listing?.bathrooms} BA
                                          </h3>
                                          |
                                          <h3 className='text-shadowGrey pl-2'>
                                            {listing?.sqft} SQFT
                                          </h3>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {searchResults.leases.length > 0 && (
                          <div className='forLeaseSearchResults'>
                            <h2 className='pb-3 mb-8 border-b border-b-casperWhite'>
                              Featured Leases
                            </h2>
                            <div className='grid grid-cols-2 gap-x-4 gap-y-8'>
                              {searchResults.leases.map(
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                (listing: any, key: any) => (
                                  <Link
                                    key={key}
                                    href={`properties/featured-leases/${listing?.homeURL?.current}`}
                                    onClick={(e) =>
                                      navigateWithTransition(
                                        `properties/featured-leases/${listing?.homeURL?.current}`,
                                        e
                                      )
                                    }
                                  >
                                    <div className='row flex gap-x-4'>
                                      <Image
                                        src={urlFor(listing.homeThumbnail)
                                          .width(150)
                                          .height(150)
                                          .url()}
                                        alt={`${listing.homeThumbnail?.alt}`}
                                        width={150}
                                        height={150}
                                        className='rounded-lg'
                                      />
                                      <div className='listingInfo '>
                                        <h3>
                                          <b>{listing.address?.line1},</b>
                                        </h3>
                                        <h3>
                                          <b>{listing.address?.line2}</b>
                                        </h3>
                                        <h3 className='mt-3'>
                                          ${listing.price}
                                        </h3>
                                        <div className='flex mt-[10px] text-shadowGrey items-center'>
                                          <h3 className='text-shadowGrey pr-2'>
                                            {listing?.bedrooms} BD
                                          </h3>
                                          |
                                          <h3 className='text-shadowGrey px-2'>
                                            {listing?.bathrooms} BA
                                          </h3>
                                          |
                                          <h3 className='text-shadowGrey pl-2'>
                                            {listing?.sqft} SQFT
                                          </h3>
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {searchResults.blogs.length > 0 && (
                          <div className='blogPostResults'>
                            <h2 className='pb-3 mb-8 border-b border-b-casperWhite'>
                              Blog Posts
                            </h2>
                            <div className='grid grid-cols-2 gap-x-4 gap-y-8'>
                              {searchResults.blogs.map(
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                (post: any, key: any) => (
                                  <Link
                                    key={key}
                                    href={`/blog/${post?.articleTitle
                                      ?.toLowerCase()
                                      .replace(/[^a-z0-9]+/g, "-")
                                      .replace(/^-+|-+$/g, "")
                                      .slice(0, 200)}`}
                                    onClick={(e) =>
                                      navigateWithTransition(
                                        `/blog/${post?.articleTitle
                                          ?.toLowerCase()
                                          .replace(/[^a-z0-9]+/g, "-")
                                          .replace(/^-+|-+$/g, "")
                                          .slice(0, 200)}`,
                                        e
                                      )
                                    }
                                  >
                                    <div className='row flex gap-x-4'>
                                      <Image
                                        src={urlFor(post?.articleThumbnail)
                                          .width(150)
                                          .height(150)
                                          .url()}
                                        alt={`${post?.articleThumbnail?.alt}`}
                                        width={150}
                                        height={150}
                                        className='rounded-lg h-[150px] w-[150px]'
                                      />
                                      <div className='articleInfo'>
                                        <h5 className='date mb-1 font-bold'>
                                          {formatDate(post?.articleDate ?? "")}
                                        </h5>
                                        <h3>{post?.articleTitle}</h3>
                                        <div className='filters flex gap-3 mt-4'>
                                          {post?.filters?.map(
                                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                            (filter: any, index: any) => (
                                              <span
                                                className='h3 blogFilter !w-fit'
                                                key={index}
                                              >
                                                {filter}
                                              </span>
                                            )
                                          )}
                                        </div>
                                        <p className='summary mt-6'>
                                          {post?.articleText
                                            ?.find(
                                              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                              (paragraph: any) =>
                                                paragraph.style === "normal"
                                            )
                                            ?.children?.[0]?.text?.split(" ")
                                            ?.slice(0, 27)
                                            ?.join(" ") + "..."}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </ModalContent>
            </Modal>

            {/* ) : null} */}
          </div>
        </ul>
      </div>
    </motion.nav>
  );
}
