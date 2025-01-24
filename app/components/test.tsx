"use client";
import React, { useState, useEffect } from "react";

const test = () => {
  const [countries, setCountries] = useState([]);
  const [capitals, setCapitals] = useState("");
  //   <Capital[]>([]);
  //   useState<Capital[]>([]);
  const BASE_URL = "https://restcountries.com/v3.1";

  const FILTERABLE_CAPITALS = [
    "Tallinn",
    "Helsinki",
    "Stockholm",
    "Oslo",
    "Copenhagen",
    "Reykjavik",
  ] as const;
  type Capital = (typeof FILTERABLE_CAPITALS)[number];
  useEffect(() => {
    async function fetchCountries() {
      try {
        const data = await fetch(`${BASE_URL}/all`);
        const response = await data.json();
        setCountries(response);
      } catch (error) {
        console.log("Error:", Error);
      }
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    async function fetchCapitals() {
      try {
        FILTERABLE_CAPITALS.map((c) => {
          //   console.log(c);
          setCapitals(c);
          return c;
        });

        console.log(capitals);
        // setCapitals([capital]);

        const data = await fetch(`${BASE_URL}/capital/${capitals}`);
        await data.json();
      } catch (error) {}
    }
    fetchCapitals();
  }, []);

  //   console.log(capitals);

  return <div>test</div>;
};

export default test;
