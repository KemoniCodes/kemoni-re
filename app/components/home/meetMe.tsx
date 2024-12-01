"use client";
import React, { useState, useEffect } from "react";
import type { MeetMe } from "@/sanity/types";
import { getMeetMe } from "@/sanity/sanity.query";
import { urlFor } from "../../utils/imageUrl";
import Link from "next/link";
import Image from "next/image";

export default function MeetMe() {
  const [meetMeData, setMeetMeData] = useState<MeetMe | null>(null);

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

  console.log(meetMeData?.portrait);

  return (
    <div className='meetMe section'>
      <div 
      className='flex items-center'
      >
        <div className='left'>
        <span className='titles'>
          <h2>meet</h2>
          <h1>
            Kemoni
            <br />
            Williams
          </h1>
        </span>
        <div className='mt-8 w-[80%]'>
          <p 
          // className='col-start-1 col-span-5 mt-8 row-start-2'
          >
            {meetMeData?.shortBio}</p>
        </div>
        </div>
        <div className='right w-full'>
        {meetMeData?.portrait ? (
          <Image
            src={urlFor(meetMeData.portrait).width(500).height(500).url() || ""}
            // src={meetMeData?.portrait || ""}
            alt={meetMeData?.portrait?.alt || "Default alt text"}
            width={500}
            height={500}
            className="w-full"
            // className='col-span-6 col-start-7 w-full row-start-1'
          />
        ) : null}
        </div>
      </div>
    </div>
  );
}
