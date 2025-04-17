import React from "react";
import FeaturedListings from "./components/home/featuredListings";
import MeetMe from "./components/home/meetMe";
import Neighborhoods from "./components/home/neighborhoods";
import Hero from "./components/home/hero";
import WorkWithMe from "./components/home/workWithMe";

export default function Home() {
  return (
      <div className='home'>
        <main className='hero lg:h-screen h-[80vh] lg:mb-24 mb-0'>
          <Hero />
        </main>
        <FeaturedListings />
        <MeetMe />
        <Neighborhoods />
        <WorkWithMe />
      </div>
  );
}
