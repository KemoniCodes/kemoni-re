"use client";
import React, { useState } from "react";
import SwipeButton from "../animata/button/swipe-button";

export default function WorkWithMe() {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSending(true);
    setIsSent(false);

    const formData = new FormData(event.target as HTMLFormElement);

    formData.append("access_key", "411ab50c-22b5-401f-8de5-79318514a4d0");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });
      const result = await response.json();
      if (result.success) {
        console.log(result);
        setIsSent(true);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        event.target.reset();
      } else {
        console.error("Submission failed:", result);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className='workWithMe section px-52'>
      <h2 className='text-center mb-24'>work with me</h2>
      <form onSubmit={handleSubmit} className='text-center'>
        <div className='row flex gap-8 mb-20'>
          <div className='flex flex-col mb-8 w-full text-left'>
            <label className='li'>name*</label>
            <input
              type='text'
              id='name'
              name='name'
              // value={formData.name}
              // onChange={handleChange}
              required
              className=' li border-b-casperWhite border-b-[1px]  bg-transparent'
            />
          </div>

          <div className='flex flex-col mb-8 w-full text-left'>
            <label className='li '>email*</label>
            <input
              type='email'
              id='email'
              name='email'
              // value={formData.email}
              // onChange={handleChange}
              required
              className='li border-b-casperWhite border-b-[1px] bg-transparent'
            />
          </div>

          <div className='flex flex-col mb-8 w-full text-left'>
            <label className='li'>Phone*</label>
            <input
              type='tel'
              id='phone'
              name='phone'
              //   pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
              required
              className='li border-b-casperWhite border-b-[1px] bg-transparent'
            />
          </div>
        </div>

        <div className='flex flex-col mb-8 text-left'>
          <label className='li '>message*</label>
          <textarea
            id='message'
            name='message'
            // value={formData.message}
            // onChange={handleChange}
            required
            rows={8}
            className='li border-b-casperWhite border-b-[1px]  bg-transparent'
          />
        </div>
        {/* <button
          type='submit'
          className="mt-14"
          //   className='h3 bg-ghostWhite py-4 px-16 hover:bg-transparent hover:border-ghostWhite hover:border-[2.5px] !text-midnightBlack hover:!font-semibold
          //             transition-lightButtonHover
          //             '
        >
          {isSending ? "Submitting..." : isSent ? "Submitted!" : "Submit"}
        </button> */}
        <SwipeButton
          className='second'
          type='submit'
          firstClass=''
          firstText={`${isSending ? "Submitting..." : isSent ? "Submitted!" : "Submit"}`}
          secondClass='bg-casperWhite text-offBlack'
          secondText={`${isSending ? "Submitting..." : isSent ? "Submitted!" : "Submit"}`}
        />
      </form>
    </div>
  );
}
