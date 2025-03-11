"use client";
import React, { useState, useEffect, useRef } from "react";
import type { MeetMe } from "@/sanity/types";
import { getMeetMe } from "@/sanity/sanity.query";
import { urlFor } from "../../utils/imageUrl";
import Image from "next/image";
import Link from "next/link";
import SwipeButton from "../animata/button/swipe-button";
import { useTransitionRouterWithEffect } from "../../utils/pageTransition";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { useGSAP } from "@gsap/react";
// import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function MeetMe() {
  const [meetMeData, setMeetMeData] = useState<MeetMe | null>(null);

  const navigateWithTransition = useTransitionRouterWithEffect();
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMeetMe();
        setMeetMeData(data);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!container.current) return;

    // const heroHeading = container.current?.querySelector(
    //   ".meetMe .titles"
    // ) as HTMLElement;
    // if (!heroHeading) {
    //   console.error("Hero heading not found");
    //   return;
    // }

    // const heroText = new SplitType(heroHeading, { types: "words" });

    // gsap.set(heroText.words, { y: 200, opacity: 0 });

    // gsap.to(heroText.words, {
    //   y: 0,
    //   opacity: 1,
    //   duration: 1.5,
    //   stagger: 0.075,
    //   ease: "power4.out",
    //   scrollTrigger: {
    //     trigger: heroHeading,
    //     // start: "top 80%", // Adjust where the animation starts
    //     // end: "top 50%", // Adjust where it ends
    //     toggleActions: "play none none none",
    //   },
    // });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container.current,
        { opacity: 0, y: 150 }, // Less extreme movement
        {
          opacity: 1,
          y: 0,
          duration: 1.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 85%",
            end: "top 45%",
            scrub: 0.2,
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [meetMeData]);

  console.log(meetMeData?.portrait);

  return (
    <motion.div className='meetMe section' ref={container}>
      <div className='flex items-center'>
        <div className='left'>
          <span className='titles'>
            <h2>meet</h2>
            <h1 className='leading-[110px]'>
              Kemoni
              <br />
              Williams
            </h1>
          </span>
          <div className='my-8 w-[80%]'>
            <p
            // className='col-start-1 col-span-5 mt-8 row-start-2'
            >
              {meetMeData?.shortBio}
            </p>
          </div>
          <Link
            href={"/about"}
            onClick={(e) => navigateWithTransition("/about", e)}
            // className="button"
          >
            <SwipeButton
              className='second'
              firstClass=''
              firstText='learn more'
              secondClass='bg-casperWhite text-offBlack'
              secondText='learn more'
            />
          </Link>
          {/* </button> */}
        </div>
        <div className='right w-full'>
          {meetMeData?.portrait ? (
            <Image
              src={
                urlFor(meetMeData.portrait).width(500).height(500).url() || ""
              }
              // src={meetMeData?.portrait || ""}
              alt={meetMeData?.portrait?.alt || "Default alt text"}
              width={500}
              height={500}
              className='w-full rounded-lg'
              // className='col-span-6 col-start-7 w-full row-start-1'
            />
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
