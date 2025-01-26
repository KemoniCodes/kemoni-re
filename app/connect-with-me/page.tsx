import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/verticalLogo.svg";
import BgImg from "../../public/bizCardImg.jpg";

export default function ConnectWithMe() {
  return (
    <>
      <div className='connectWithMe'>
        <div
          className='connectWithMeBgImg bg-cover -ml-8 pl-8 lg:h-[50vh] w-screen h-[24vh]'
          style={{
            backgroundImage: BgImg ? `url(${BgImg.src})` : "none",
          }}
        >
          <div className='absolute inset-0 bg-black opacity-50 lg:h-[50vh] w-screen h-[24vh]' />
        </div>
        <Image
          src={Logo}
          alt='Kemoni Williams Real Estate Logo'
          width={202.91}
          height={110}
          className='mx-auto relative -mt-8'
        />

        <div className='contactInfo mt-[76px]'>
          <ul className='text-center list-none flex flex-col gap-8'>
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
                <Link className='' href={"tel:562-234-6847"}>
                  562-234-6847
                </Link>
              </h3>
              <p className=' text-shadowGrey text-[16px]'>phone</p>
            </li>
            <li>
              <h3 className='normal-case '>
                <Link className='' href={"/"} target='#'>
                  kemoniwilliams.com
                </Link>
              </h3>
              <p className=' text-shadowGrey text-[16px]'>website</p>
            </li>
            <li>
              <h3 className='underline underline-[1px] leading-6'>
                <Link
                  href={
                    "https://drive.google.com/file/d/1U8E4-9cBNnh6l91tuVWlGVpnc5O7Ogp2/view?usp=sharing"
                  }
                  target='#'
                >
                  Access Your Complimentary Buyer’s Guide
                </Link>
              </h3>
            </li>
          </ul>
        </div>

        <div className='tagline absolute -ml-8 w-full pb-5 mt-20'>
          <h3 className=' text-center '>
            curating homes.
            <br /> curating lifestyles.
          </h3>
        </div>
      </div>
    </>
  );
}
