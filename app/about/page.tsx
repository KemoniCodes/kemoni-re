"use client";

import React, { useState, useEffect, useRef } from "react";
import Submark from "../../public/submark.png";
import Image from "next/image";
import { MeetMe } from "@/sanity/types";
import { getMeetMe } from "@/sanity/sanity.query";
import Agent from "../components/agent";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

gsap.registerPlugin(useGSAP);

export default function About() {
  const [aboutData, setAboutData] = useState<MeetMe | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMeetMe();
        setAboutData(data);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log(container.current);
    if (!container.current) return;

    const heroHeading = container.current?.querySelector(
      ".aboutPage h1"
    ) as HTMLElement;
    if (!heroHeading) {
      console.error("Hero heading not found");
      return;
    }

    //   const heroSubHeading = container.current?.querySelector(
    //     ".neighborhoodPage .subtitle"
    //   ) as HTMLElement;
    //   if (!heroSubHeading) {
    //     console.error("Hero sub heading not found");
    //     return;
    //   }

    const heroText = new SplitType(heroHeading, { types: "chars" });
    console.log("SplitType output:", heroText.chars);

    gsap.set(heroText.chars, { y: 240 });

    gsap.to(heroText.chars, {
      y: 0,
      duration: 1,
      stagger: 0.075,
      ease: "power4.out",
      delay: 0.8,
    });

    //   const subHeroText = new SplitType(heroSubHeading, { types: "lines" });
    //   console.log("SplitType output:", subHeroText.lines);

    //   gsap.set(subHeroText.lines, { y: 200 });

    //   gsap.to(subHeroText.lines, {
    //     y: 0,
    //     duration: 1,
    //     stagger: 0.075,
    //     ease: "power4.out",
    //     delay: 1.3,
    //   });

    return () => {
      heroText.revert();
      // subHeroText.revert();
    };
  }, [aboutData]);

  const forBuyers = aboutData?.buyersJourney?.map((step) => ({
    id: step?._key,
    label: step?.buyerStep,
    content: step?.buyerStepDesc,
  }));

  if (!aboutData) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className='aboutPage' ref={container}>
      <div
        className='heroContainer w-screen bg-cover h-[700px] relative top-0  -ml-8 -mt-16 pl-8'
        style={{
          backgroundImage: "url('/nhImg.png')",
        }}
      >
        <div className='absolute inset-0 bg-black opacity-50' />
        <div className='heroText absolute bottom-0 pb-4'>
          <h1
            //   !-bottom-[12.5vh]
            className='whitespace-pre-wrap !bottom-[15.5vh]'
            style={{ transform: "translate(-50%, 50%)" }}
          >
            {/* !-bottom-[27.5vh] */}
            {/* MODERN
            <br />
            REPRESENTATION
            <br />
            FOR THE
            <br />
            MODERN BUYER */}
            Your trusted
            <br /> real estate partner
          </h1>
          {/* <p className='subtitle'>
            {currentNeighborhood?.neighborhoodGuide?.neighborhoodTagline}
          </p> */}
        </div>
      </div>

      <div className='aboutInfoContainer mt-14'>
        <div className='row flex gap-32'>
          <div className='left w-[40%] flex flex-col gap-24'>
            <div className='block'>
              <h2 className='mb-6'>Behind the Vision</h2>
              <p className=''>{aboutData?.shortBio}</p>
            </div>
            <div className='block'>
              <h2 className='mb-6'>My commitment</h2>
              <ul className='list-none flex flex-col gap-[30px]'>
                {aboutData?.myCommitment?.map((commitment, key) => (
                  <li className='flex p uppercase gap-[22px]' key={key}>
                    {/* <span> */}
                      <Image
                        src={Submark}
                        alt='submark'
                        width={21.61}
                        height={37.4}
                        className="h-fit"
                      />
                    {/* </span> */}
                    <div className='text flex flex-col'>
                      {commitment?.commitmentTtile}
                      <p className='normal-case mt-3'>
                        {commitment?.commitmentDesc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='right w-[60%] -mt-14 relative -right-8'>
            <div className='bg-shadowGrey w-full h-[60%]'></div>
          </div>
        </div>
      </div>

      <div className='journeyContainer mt-36'>
        <div className='header'>
          <h1>The Journey</h1>
          <p className='subtitle pr-[50%]'>
            Every real estate journey is unique. Whether you're buying or
            selling, my approach is tailored to your individual needs, ensuring
            a seamless, informed, and successful experience every step of the
            way.
          </p>
        </div>
        <div className='flex w-full flex-col'>
          <Tabs aria-label='Main tabs' variant='underlined'>
            <Tab key='forBuyers' title='For Buyers'>
              {aboutData?.buyersJourney?.map((step, key) => (
                <Card
                  className='bg-casperWhite h-auto rounded-lg py-5 px-10 text-center pl-6 w-[25vw] my-11'
                  key={key}
                >
                  <CardBody>
                    <div className='flex h2 gap-[14px]' key={key}>
                      <span className='p !text-offBlack'>0{key + 1}.</span>
                      <div className='text flex flex-col text-offBlack leading-8'>
                        {step?.buyerStep}
                        <p className='normal-case mt-3 text-offBlack'>
                          {step?.buyerStepDesc}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </Tab>

            <Tab key='forSellers' title='For Sellers'>
              {aboutData?.sellersJourney?.map((step, key) => (
                <Card
                  className='bg-casperWhite h-auto rounded-lg py-5 px-10 text-center pl-6 w-[25vw] my-11'
                  key={key}
                >
                  <CardBody>
                    <div className='flex h2 gap-[14px]' key={key}>
                      <span className='p !text-offBlack'>0{key + 1}.</span>
                      <div className='text flex flex-col text-offBlack leading-8'>
                        {step?.sellerStep}
                        <p className='normal-case mt-3 text-offBlack'>
                          {step?.sellerStepDesc}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </Tab>
          </Tabs>
        </div>
      </div>
      <div className='contactAgent mt-36'>
        <Agent />
      </div>
    </div>
  );
}
