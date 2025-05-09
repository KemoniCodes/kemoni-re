"use client";
import React, { useState, useEffect, useRef } from "react";
import { Blog } from "@/sanity/types";
import { getBlog } from "@/sanity/sanity.query";
import Link from "next/link";
import { urlFor } from "@/app/utils/imageUrl";
import { usePathname } from "next/navigation";
import { useTransitionRouterWithEffect } from "../../utils/pageTransition";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

export default function ArticlePage() {
  const [articleData, setArticleData] = useState<Blog | null>(null);

  const navigateWithTransition = useTransitionRouterWithEffect();
  const container = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!container.current) return;

    const heroHeading = container.current?.querySelector(
      ".articlePage .heading h1"
    ) as HTMLElement;
    if (!heroHeading) {
      console.error("Hero heading not found");
      return;
    }

    const heroSubHeading = container.current?.querySelector(
      ".articlePage .subHeadings"
    ) as HTMLElement;
    if (!heroSubHeading) {
      console.error("Hero sub heading not found");
      return;
    }

    const heroText = new SplitType(heroHeading, { types: "lines" });
    console.log("SplitType output:", heroText.lines);

    gsap.set(heroText.lines, { y: 500 });

    gsap.to(heroText.lines, {
      y: 0,
      duration: 1.5,
      stagger: 0.075,
      ease: "power4.out",
      delay: 0.8,
    });

    const subHeroText = new SplitType(heroSubHeading, { types: "words" });
    console.log("SplitType output:", subHeroText.words);

    gsap.set(subHeroText.words, { y: 200 });

    gsap.to(subHeroText.words, {
      y: 0,
      duration: 1,
      stagger: 0.075,
      ease: "power4.out",
      delay: 1.3,
    });

    const filters = container.current?.querySelectorAll(
      ".articlePage .blogFilter"
    ) as NodeListOf<HTMLElement>;

    gsap.set(filters, { opacity: 0, y: 50 });

    gsap.to(filters, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
      delay: 1.5,
    });

    return () => {
      heroText.revert();
      subHeroText.revert();
      // filters.revert();
    };
  }, [currentArticle]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const articleThumbnail = currentArticle?.articleThumbnail?.asset?._ref
    ? urlFor(currentArticle?.articleThumbnail).url()
    : null;

  const currentTags = currentArticle?.filters?.map((tag) => {
    return tag;
  });

  const matchingArticles = articleData?.articles?.filter(
    (article) =>
      article !== currentArticle &&
      article?.filters?.some((filter) => currentTags?.includes(filter))
  );

  const otherArticles =
    articleData?.articles?.filter((article) => article !== currentArticle) ??
    [];

  console.log(articleData);

  if (!articleThumbnail) {
    return <h2>Loading...</h2>;
  }

  if (!currentArticle) {
    return <h2>Article not found</h2>;
  }

  return (
    <div className='articlePage mt-40' ref={container}>
      <div className='heading'>
        <h1 className="top-36">{currentArticle?.articleTitle}</h1>
      </div>
      <div className='subHeadings flex gap-x-14 items-center mt-9'>
        <h3 className='date'>
          {formatDate(currentArticle?.articleDate ?? "")}
        </h3>
        <h3>kemoni williams</h3>
        <div className='filters flex gap-3'>
          {currentArticle?.filters?.map((filter, index) => (
            <span className='h3 blogFilter !w-fit mr-3' key={index}>
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

      {(matchingArticles?.length ?? 0) > 0 ? (
        <div className='relatedArticles relative mt-56'>
          <span className='title transition-all duration-300 ease-in-out'>
            <h2>further</h2>
            <h1>reading</h1>
          </span>

          <div className='relatedArticle pt-6 flex gap-5 w-full'>
            {matchingArticles?.map((article, index) => (
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
                <div className='article flex flex-col flex-shrink-0 max-w-[324px] transitionHover'>
                {/* -z-10 */}
                  <div
                    className='articleThumbnail bg-cover relative rounded-lg h-[324px]'
                    style={{
                      backgroundImage: article?.articleThumbnail?.asset?._ref
                        ? `url(${urlFor(article.articleThumbnail).url()})`
                        : article?.articleThumbnail
                          ? `url(${article.articleThumbnail})`
                          : "none",
                    }}
                  >
                    <div className='absolute inset-0 bg-black opacity-50' />
                    <div className='thumbnailFilter absolute top-0 p-4'>
                      <div className='filters flex gap-3'>
                        {article?.filters?.map((filter, index) => (
                          <span className='h3 blogFilter !w-fit' key={index}>
                            {filter}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='homeInfo mt-5'>
                    <h3>
                      <b>{article?.articleTitle}</b>
                    </h3>
                    <h3 className='mt-[6px]'>
                      {formatDate(article?.articleDate ?? "")}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className='otherArticles relative mt-56'>
          <span className='title transition-all duration-300 ease-in-out'>
            <h2>explore</h2>
            <h1>more</h1>
          </span>

          <div className='otherArticle pt-6 flex gap-5 w-full'>
            {otherArticles?.map((article, index) => (
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
                <div className='article flex flex-col flex-shrink-0 max-w-[324px] transitionHover'>
                {/* -z-10 */}
                  <div
                    className='articleThumbnail bg-cover relative rounded-lg h-[324px]'
                    style={{
                      backgroundImage: article?.articleThumbnail?.asset?._ref
                        ? `url(${urlFor(article.articleThumbnail).url()})`
                        : article?.articleThumbnail
                          ? `url(${article.articleThumbnail})`
                          : "none",
                    }}
                  >
                    <div className='absolute inset-0 bg-black opacity-50' />
                    <div className='thumbnailFilter absolute top-0 p-4'>
                      <div className='filters flex gap-3'>
                        {article?.filters?.map((filter, index) => (
                          <span className='h3 blogFilter !w-fit' key={index}>
                            {filter}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className='homeInfo mt-5'>
                    <h3>
                      <b>{article?.articleTitle}</b>
                    </h3>
                    <h3 className='mt-[6px]'>
                      {formatDate(article?.articleDate ?? "")}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
