"use client";
import React, { useState, useEffect } from "react";
import { Blog } from "@/sanity/types";
import { getBlog } from "@/sanity/sanity.query";
// import Link from "next/link";
// import Image from "next/image";
import { urlFor } from "@/app/utils/imageUrl";
import { usePathname } from "next/navigation";

export default function ArticlePage() {
  const [articleData, setArticleData] = useState<Blog | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBlog();
        setArticleData(data);
      } catch (error) {
        console.error("Error", error);
      }
    }
    fetchData();
  }, []);

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const mainPathnameSlug = segments[1];

  const slugify = (input: string) =>
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 200);

  const currentArticle = articleData?.articles?.find((article) => {
    const articleTitle = article?.articleTitle;
    if (!articleTitle) return false;
    const articleSlug = slugify(articleTitle);
    console.log(articleSlug);
    return mainPathnameSlug === articleSlug;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const articleThumbnail = articleData?.articles?.map((article) => {
    return article?.articleThumbnail?.asset?._ref
      ? urlFor(article?.articleThumbnail).url()
      : null;
  });

  console.log(articleData);

  if (!articleData) {
    return <h2>Loading...</h2>;
  }

  if (!currentArticle) {
    return <h2>Article not found</h2>;
  }

  return (
    <div className='articlePage mt-40'>
      <div className='heading'>
        <h1>{currentArticle?.articleTitle}</h1>
      </div>
      <div className='subHeadings flex gap-x-14 items-center mt-9'>
        <h3 className='date'>
          {formatDate(currentArticle?.articleDate ?? "")}
        </h3>
        <h3>kemoni williams</h3>
        <div className='filters flex gap-3'>
          {currentArticle?.filters?.map((filter, index) => (
            <span className='h3 blogFilter !w-fit' key={index}>
              {filter}
            </span>
          ))}
        </div>
      </div>
      <div
        className='heroContainer w-screen bg-cover h-[700px] relative -ml-8 pl-8 mt-28'
        style={{
          backgroundImage: articleThumbnail
            ? `url(${articleThumbnail})`
            : "none",
        }}
      ></div>

      <div className='paragraphCallout mt-32 mx-14'>
        <h2 className='leading-8 text-justify'>
          {
            currentArticle?.articleText?.find(
              (paragraph) => paragraph.style === "h2"
            )?.children?.[0]?.text
          }
        </h2>
      </div>

      <div className='articleContent flex flex-col mt-36 px-64'>
        {currentArticle?.articleText
          ?.map((paragraph, index, array) => {
            if (paragraph.style === "h2" && index === 0) {
              return null;
            }

            if (paragraph.style === "h2") {
              return (
                <div key={index} className='articleContentSection mb-16'>
                  <h2>{paragraph.children?.[0]?.text}</h2>
                  {array[index + 1]?.style === "normal" && (
                    <p className='mt-4'>
                      {array[index + 1]?.children?.[0]?.text}
                    </p>
                  )}
                </div>
              );
            }
            return null;
          })
          .filter(Boolean)}
      </div>
    </div>
  );
}
