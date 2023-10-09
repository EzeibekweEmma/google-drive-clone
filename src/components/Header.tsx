"use client";
import React, { useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import UserInfo from "./UserInfo";

function Header() {
  const [displayUserInfo, setDisplayUserInfo] = useState(false);
  const { data: session } = useSession();
  if (session === null) {
    signIn();
  }
  return (
    <header className="relative flex h-16 w-screen items-center justify-between px-5 py-2">
      <a href="#" className="ml-2 flex items-center space-x-2">
        <Image
          src="/logo.png"
          width={500}
          height={500}
          alt="logo"
          className="h-10 w-10 object-contain object-center"
          draggable={false}
        />
        <h1 className="text-2xl tracking-tight text-[#444746]">Drive</h1>
      </a>
      <form className="relative w-[50vw] min-w-[500px]">
        <input
          type="text"
          placeholder="Search in Drive"
          className="w-full rounded-full bg-[#EDF2FC] px-2 py-[10px] indent-11 duration-500 placeholder:text-[#444746] focus:bg-white focus:shadow-md focus:outline-none"
        />
        <MagnifyingGlassIcon className="absolute left-4 top-[12px] h-5 w-5 stroke-[#444746]" />
        <input type="submit" hidden />
      </form>
      <div
        onClick={() => {
          setDisplayUserInfo((prev) => !prev);
        }}
        className="h-8 w-8 cursor-pointer overflow-hidden rounded-full"
      >
        <a href="#">
          <Image
            src={session?.user.image as string}
            className="h-full w-full rounded-full object-center"
            height={500}
            width={500}
            draggable={false}
            alt="avatar"
          />
        </a>
      </div>
      <div className="absolute right-5 top-16 z-20">
        {displayUserInfo && (
          <UserInfo setDisplayUserInfo={setDisplayUserInfo} />
        )}
      </div>
    </header>
  );
}

export default Header;
