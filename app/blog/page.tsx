"use client";
import React, { useState, useEffect, useRef } from "react";
import { Blog } from "@/sanity/types";
import { getBlog } from "@/sanity/sanity.query";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../utils/imageUrl";
import { useTransitionRouterWithEffect } from "../utils/pageTransition";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

export default function Musings() {
  const [blogData, setBlogData] = useState<Blog | null>(null);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState<string | null>(null);

  const navigateWithTransition = useTransitionRouterWithEffect();
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBlog();
        setBlogData(data);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleFilterBtnClick = (filter: string) => {
    setSelectedBtn((prev) => (prev === filter ? null : filter));

    setIsClicked((prev) => !prev);
  };

  if (isClicked) {
    console.log(selectedBtn);
    console.log("clicked");
  }

  useEffect(() => {
    if (!container.current) return;

    const heroHeading = container.current?.querySelector(
      ".musingsPage h1"
    ) as HTMLElement;
    if (!heroHeading) {
      console.error("Hero heading not found");
      return;
    }

    const heroSubHeading = container.current?.querySelector(
      ".musingsPage .subtitle"
    ) as HTMLElement;
    if (!heroSubHeading) {
      console.error("Hero sub heading not found");
      return;
    }

    const heroText = new SplitType(heroHeading, { types: "chars" });
    console.log("SplitType output:", heroText.chars);

    gsap.set(heroText.chars, { y: 200 });

    gsap.to(heroText.chars, {
      y: 0,
      duration: 1,
      stagger: 0.075,
      ease: "power4.out",
      delay: 0.8,
    });

    const subHeroText = new SplitType(heroSubHeading, { types: "lines" });
    console.log("SplitType output:", subHeroText.lines);

    gsap.set(subHeroText.lines, { y: 200 });

    gsap.to(subHeroText.lines, {
      y: 0,
      duration: 1,
      stagger: 0.075,
      ease: "power4.out",
      delay: 1.3,
    });

    return () => {
      heroText.revert();
      subHeroText.revert();
    };
  }, [blogData]);

  if (!blogData) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className='musingsPage mt-36' ref={container}>
      <div className='header'>
        <h1>{blogData?.title}</h1>
        <p className='subtitle pr-[50%] !top-8'>{blogData?.subTitle}</p>
      </div>
      <div className='blogInfoContainer flex mt-44 w-full gap-32'>
        <div className='left grid grid-cols-4 gap-4 gap-x-3 h-fit flex-1 sticky top-24 self-start'>
          {blogData?.allFilters?.map((filter, index) => (
            <span
              className={`h3 blogFilter transitionHover hover:cursor-pointer ${
                selectedBtn === filter
                  ? "selected !bg-crimsonRed !text-casperWhite"
                  : ""
              }`}
              key={index}
              onClick={() => handleFilterBtnClick(filter)}
            >
              {filter}
            </span>
          ))}
        </div>
        <div className='right flex-1 overflow-y-auto'>
          <div className='articlesContainer'>
            {blogData &&
              blogData.articles &&
              (blogData.articles.filter(
                (article) =>
                  !selectedBtn ||
                  article.filters?.includes(
                    selectedBtn as
                      | "🏡 Buyers"
                      | "💰 Sellers"
                      | "💳 Finance"
                      | "📈 Market"
                      | "🍸 Lifestyle"
                      | "🖼️ Design"
                      | "📰 News"
                      | "🪩 Events"
                      | "💻 Tech"
                  )
              ).length > 0 ? (
                blogData.articles
                  .filter(
                    (article) =>
                      !selectedBtn ||
                      article.filters?.includes(
                        selectedBtn as
                          | "🏡 Buyers"
                          | "💰 Sellers"
                          | "💳 Finance"
                          | "📈 Market"
                          | "🍸 Lifestyle"
                          | "🖼️ Design"
                          | "📰 News"
                          | "🪩 Events"
                          | "💻 Tech"
                      )
                  )
                  .map((article, index) => (
                    <Link
                      href={`/blog/${article?.articleTitle
                        ?.toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "")
                        .slice(0, 200)}`}
                      key={index}
                      onClick={(e) =>
                        navigateWithTransition(
                          `/blog/${article?.articleTitle
                            ?.toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "")
                            .slice(0, 200)}`,
                          e
                        )
                      }
                    >
                      <div className='article transitionHover mb-20'>
                        <Image
                          src={urlFor(article?.articleThumbnail)
                            .width(670)
                            .height(326)
                            .url()}
                          alt={`${article?.articleThumbnail?.alt}`}
                          width={670}
                          height={326}
                          className='rounded-lg'
                        />
                        <div className='articleText mt-8 w-[80%]'>
                          <h3 className='date mb-[10px]'>
                            {formatDate(article?.articleDate ?? "")}
                          </h3>
                          <h2 className='leading-8'>{article?.articleTitle}</h2>
                          <div className='filters flex gap-3 mt-4'>
                            {article?.filters?.map((filter, index) => (
                              <span
                                className='h3 blogFilter !w-fit'
                                key={index}
                              >
                                {filter}
                              </span>
                            ))}
                          </div>
                          <p className='summary mt-6'>
                            {article?.articleText
                              ?.find(
                                (paragraph) => paragraph.style === "normal"
                              )
                              ?.children?.[0]?.text?.split(" ")
                              ?.slice(0, 27)
                              ?.join(" ") + "..."}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
              ) : (
                <h2 className='text-center mt-10'>
                  No articles found for &quot;{selectedBtn}&quot;
                </h2>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
