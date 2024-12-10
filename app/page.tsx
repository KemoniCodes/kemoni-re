import React from "react";
import FeaturedListings from "./components/home/featuredListings";
import MeetMe from "./components/home/meetMe";
import Neighborhoods from "./components/home/neighborhoods";
import Hero from "./components/home/hero";

export default function Home() {
  return (
    <>
      <div className='home'>
        <main className='hero h-screen mb-24'>
        <Hero/>
        </main>
        <FeaturedListings />
        <MeetMe />
        <Neighborhoods />
      </div>
    </>
  );
}
