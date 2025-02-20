"use client";
import React, { useState, useEffect } from "react";
import { Blog } from "@/sanity/types";
import { getBlog } from "@/sanity/sanity.query";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "../utils/imageUrl";

export default function Musings() {
  const [blogData, setBlogData] = useState<Blog | null>(null);

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
    if (!dateString) return ""; // Handle cases where date might be undefined
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  console.log(blogData);

  if (!blogData) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className='musingsPage mt-36'>
      <div className='header'>
        <h1>{blogData?.title}</h1>
        <p className='subtitle w-1/2'>{blogData?.subTitle}</p>
      </div>
      {/* gap-56 */}
      <div className='blogInfoContainer flex mt-44 w-full gap-32'>
        <div className='left grid grid-cols-4 gap-4 gap-x-3 h-fit flex-1'>
          {blogData?.allFilters?.map((filter, index) => (
            <span className='h3 blogFilter transitionHover' key={index}>
              {filter}
            </span>
          ))}
        </div>
        <div className='right flex-1'>
          <div className='articlesContainer'>
            {blogData?.articles?.map((article, index) => (
              <>
                <Link
                  href={`/musings/${article?.articleTitle?.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div className='article transitionHover' key={index}>
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
                      <div className='filters flex gap-4 mt-4'>
                        {article?.filters?.map((filter, index) => (
                          <span className='h3 blogFilter !w-fit' key={index}>
                            {filter}
                          </span>
                        ))}
                      </div>
                      <p className='summary mt-6'>
                        {article?.articleText
                          ?.find((paragraph) => paragraph.style === "normal")
                          ?.children?.[0]?.text?.split(" ")
                          ?.slice(0, 27)
                          ?.join(" ") + "..."}
                      </p>
                    </div>
                  </div>
                </Link>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
