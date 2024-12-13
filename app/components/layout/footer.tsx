import React from "react";
import Image from "next/image";
// import Link from "next/link";
import Logo from "../../../public/logo.svg";
import AgencyLogo from "../../../public/theAgencyLogo.png";

export default function Footer() {
  return (
    <footer className='mt-52 pb-4'>
      <div className='row px-10 flex gap-24 justify-between items-center'>
        <ul className='logos flex items-baseline '>
          <li className='border-r-[1px] pr-10 border-r-casperWhite py-4'>
            <Image
              className='h-full'
              src={Logo}
              width={100}
              height={50}
              alt='logo'
            />
          </li>
          <li className='pl-10 py-4'>
            <Image
              className='h-full'
              src={AgencyLogo}
              width={100}
              height={50}
              alt='logo'
            />
          </li>
        </ul>
        <ul className='flex info gap-12'>
          <ul>
            <li className='header pb-[10px]'>contact</li>
            <li>562.234.6847</li>
            <li>kemoni.w@theagencyre.com</li>
            <li>CA DRE #02247870</li>
          </ul>
          <ul>
            <li className='header pb-[10px]'>the agency</li>
            <li>
              331 Foothill Rd
              <br />
              Suite #100
              <br />
              Beverly Hills, CA 90210
            </li>
          </ul>
        </ul>
        <li className="list-none self-end">Copyright ©2024</li>
      </div>
    </footer>
  );
}
