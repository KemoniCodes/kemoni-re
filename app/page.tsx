import React from "react";
import FeaturedListings from "./components/home/featuredListings";
import MeetMe from "./components/home/meetMe";
import Neighborhoods from "./components/home/neighborhoods";

export default function Home() {
  return (
    <>
      <div className='home'>
        <main className='hero h-screen'>
          <h1 className='hero absolute bottom-0'>
            a doorway
            <br />
            to distinction.
          </h1>
        </main>
        <FeaturedListings />
        <MeetMe />
        <Neighborhoods />
      </div>
    </>
  );
}
