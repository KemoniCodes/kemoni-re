"use client";
import React, { useEffect, useState } from "react";
import Logo from "../public/verticalLogo.svg";
import Image from "next/image";
import Link from "next/link";
// import FeaturedListings from "./components/home/featuredListings";
// import MeetMe from "./components/home/meetMe";
// import Neighborhoods from "./components/home/neighborhoods";
// import Hero from "./components/home/hero";
// import WorkWithMe from "./components/home/workWithMe";
// import Test from "./components/test";
export default function Home() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const loadFlodeskScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (document.querySelector("#flodesk-script")) {
          // If script is already loaded
          console.log("Flodesk script already loaded");
          setScriptLoaded(true);
          resolve();
          return;
        }

        // Add the Flodesk script to the document
        const script = document.createElement("script");
        script.id = "flodesk-script";
        script.src = "https://assets.flodesk.com/universal.js";
        script.async = true;

        script.onload = () => {
          console.log("Flodesk script loaded successfully");
          setScriptLoaded(true); // Mark the script as loaded
          resolve();
        };

        script.onerror = () => {
          console.error("Error loading Flodesk script");
          reject(new Error("Failed to load Flodesk script"));
        };

        document.body.appendChild(script);
      });
    };

    loadFlodeskScript()
      .then(() => {
        // @ts-expect-error: ignore window.fd error
        if (typeof window !== "undefined" && window.fd) {
          console.log("Initializing Flodesk form");
          // @ts-expect-error: ignore window.fd error
          window.fd("form", {
            formId: "6793189fedc45b02d07d9413",
            containerEl: "#fd-form-6793189fedc45b02d07d9413",
          });
        } else {
          console.error("Flodesk script loaded, but `window.fd` is undefined");
        }
      })
      .catch((error) => {
        console.error("Error during Flodesk initialization:", error);
      });
  }, []);

  if (!scriptLoaded) {
    return <h2 className='p-5'>Loading...</h2>;
  }
  return (
    <>
      <div className='comingSoon'>
        <div className='logo w-full pt-6'>
          <Image
            className='mx-auto'
            src={Logo}
            alt='Kemoni Williams Logo'
            height={96}
            width={177.09}
          />
        </div>
        <div className='comingSoonContainer text-center mt-16'>
          <h1 className='!text-[46px] !leading-[45px] lg:!text-[120px]'>
            coming soon...
          </h1>
          <div className='startTodayContainer mt-16'>
            <h2 className='leading-[32px]'>start your home search today!</h2>
            <ul className='pt-3'>
              <li className='h3'>
                <Link
                  className='text-shadowGrey hover:text-casperWhite'
                  href={"mailto:kemoni@kemoniwilliams.com"}
                  target='#'
                >
                  kemoni@kemoniwilliams.com
                </Link>
              </li>
              <li className='h3 pt-[6px]'>
                <Link
                  className='text-shadowGrey hover:text-casperWhite'
                  href={"tel:562-234-6847"}
                >
                  562-234-6847
                </Link>
              </li>
              {/* <li className="h3"><Link href={'mailto:kemoni@kemoniwilliams.com'}>kemoni@kemoniwilliams.com</Link></li> */}
            </ul>
          </div>
          <div className='inTheMeanTimeContainer mt-16'>
            {/* <h2 className='mb-0'>in the mean time</h2>
            <h3 className='normal-case pt-4'>
              Sign up for off market listings, market updates etc.
            </h3> */}
            <div id='fd-form-6793189fedc45b02d07d9413'></div>
          </div>
        </div>
        {/* <main className='hero h-screen mb-24'>
          <Hero />
        </main> */}
        {/* <Test /> */}
        {/* <FeaturedListings />
        <MeetMe />
        <Neighborhoods />
        <WorkWithMe /> */}
      </div>
    </>
  );
}
