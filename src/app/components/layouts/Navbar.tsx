"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMenuAlt2 } from "react-icons/hi";

const Navbar = () => {
  return (
    <>
      <nav className="bg-background-color fixed w-full border-b z-50 h-header-height">
        <div className="flex flex-wrap justify-between items-center p-4 px-7 ">
          <div className="flex justify-center items-end gap-5">
            <Link href="/dashboard">
              <strong className="text-2xl">
                AbsenKu
                <span className="text-blue-900">.</span>
              </strong>
            </Link>
          </div>
          <div>
            <Image
              alt="profile-picture"
              src="/user.svg"
              width="35"
              height="35"
              className="cursor-pointer mr-2"
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
