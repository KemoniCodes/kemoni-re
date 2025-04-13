"use client";
import React from "react";
import contactAgentImg from '../../public/contactAgent.png';
import Link from "next/link";

export default function Agent() {
  return (
    <div className='contactAgent -ml-8 w-screen'>
      <div className='row flex'>
        <div
          className='img w-1/2 h-[90vh] bg-cover bg-center'
          style={{
            backgroundImage: contactAgentImg ? `url(${contactAgentImg.src})` : "none",
          }}
        />

        <div className='contactAgentInfo w-1/2 px-12 m-auto flex flex-col items-center'>
          <h2 className='text-center mb-12 leading-8'>Let&apos;s Start<br/> 
          the Conversation</h2>
          <div className="bg-shadowGrey w-[238px] h-[258px]"></div>
          <ul className="flex list-none gap-5 mt-16">
          <li>
              <h3 className='normal-case '>Kemoni Williams</h3>
              <p className=' text-shadowGrey text-[16px]'>
                real estate specialist
              </p>
            </li>
            <li>
              <h3 className='normal-case '>
                <Link
                  className=''
                  //   href={
                  //     "https://mail.google.com/mail/?view=cm&fs=1&to=kemoni@kemoniwilliams.com"
                  //   }
                  href={"mailto:kemoni@kemoniwilliams.com"}
                  target='#'
                >
                  kemoni@kemoniwilliams.com
                </Link>
              </h3>
              <p className=' text-shadowGrey text-[16px]'>email</p>
            </li>
            <li>
              <h3 className='normal-case '>
                <Link className='' href={"tel:310-962-1050"}>
                  310-962-1050
                </Link>
              </h3>
              <p className=' text-shadowGrey text-[16px]'>phone</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
