import React from "react";
import FeaturedListings from "./components/home/featuredListings";

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
      </div>
    </>
  );
}
