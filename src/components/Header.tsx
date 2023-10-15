"use client";
import React, { useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { AiOutlineSearch } from "react-icons/ai";
import UserInfo from "./UserInfo";
import Link from "next/link";

function Header() {
  const [displayUserInfo, setDisplayUserInfo] = useState(false);
  const { data: session } = useSession();
  if (session === null) {
    signIn();
  }
  return (
    <header className="relative flex h-16 w-screen items-center justify-between px-5 py-2">
      <div className="w-60 pl-1">
        <Link href={"/"} className="flex w-fit items-center space-x-2 p-1">
          <Image
            src="/logo.png"
            width={500}
            height={500}
            alt="logo"
            className="h-10 w-10 object-contain object-center"
            draggable={false}
          />
          <h1 className="text-textC text-2xl tracking-tight">Drive</h1>
        </Link>
      </div>
      <form className="relative flex-1">
        <input
          type="text"
          placeholder="Search in Drive"
          className="bg-darkC2 placeholder:text-textC w-full rounded-full px-2 py-[11px] indent-11 duration-500 focus:bg-white focus:shadow-md focus:outline-none"
        />
        <button
          type="submit"
          className="hover:bg-darkC absolute left-2 top-[5px] h-9 w-9 rounded-full p-2"
        >
          <AiOutlineSearch className="stroke-textC h-full w-full" stroke="2" />
        </button>
        <button type="submit" hidden />
      </form>
      <div
        onClick={() => {
          setDisplayUserInfo((prev) => !prev);
        }}
        className="ml-3 h-8 w-8 cursor-pointer overflow-hidden rounded-full"
      >
        <Image
          src={session?.user.image as string}
          className="h-full w-full rounded-full object-center"
          height={500}
          width={500}
          draggable={false}
          alt="avatar"
        />
      </div>
      <div className="absolute right-5 top-16">
        {displayUserInfo && (
          <UserInfo setDisplayUserInfo={setDisplayUserInfo} />
        )}
      </div>
    </header>
  );
}

export default Header;
