"use client";
import React from "react";
import contactAgentImg from '../../public/contactAgent.png';

export default function Agent() {
  return (
    <div className='contactAgent'>
      <div className='row flex'>
        <div
          className='img w-1/2 h-[90vh] bg-cover bg-center'
          style={{
            backgroundImage: contactAgentImg ? `url(${contactAgentImg.src})` : "none",
          }}
        />
        <div className='contactAgentInfo w-1/2 px-12 m-auto'>
          <h2 className='text-center mb-6'>Let&apos;s Start<br/> 
          the Conversation</h2>
          <div className="bg-shadowGrey w-[238px] h-[258px]"></div>
          <div className="flex"></div>
        </div>
      </div>
    </div>
  );
}
