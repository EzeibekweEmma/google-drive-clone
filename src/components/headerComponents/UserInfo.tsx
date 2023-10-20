import React from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { PiSignOutBold } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

function UserInfo({ setDisplayUserInfo }: UserInfoProps) {
  const { data: session } = useSession();
  return (
    <div
      className="relative z-10 flex flex-col items-center justify-center
    space-y-3 rounded-2xl bg-darkC2 px-5 py-3 text-sm font-medium text-textC
    shadow-md shadow-[#b4bebb]"
    >
      <button
        onClick={() => setDisplayUserInfo((prev: boolean) => false)}
        className="absolute right-3 top-3 rounded-full bg-darkC2 p-1 hover:bg-darkC"
      >
        <AiOutlineClose className="h-5 w-5 rounded-full stroke-2 text-textC" />
      </button>
      <p>{session?.user.email}</p>
      <div className="h-20 w-20 rounded-full border">
        <Image
          src={session?.user.image as string}
          className="h-full w-full rounded-full object-center"
          height={500}
          width={500}
          draggable={false}
          alt="avatar"
        />
      </div>
      <h2 className="tablet:text-2xl text-xl font-normal">
        Hi, {session?.user.name}!
      </h2>
      <button className="rounded-full border border-black px-7 py-2 text-textC2 hover:bg-[#d3dfee]">
        Manage your Google Account
      </button>
      <div className="flex space-x-1">
        <button className="tablet:w-44 flex w-36 items-center space-x-2 rounded-l-full bg-white py-3 pl-3  hover:bg-darkC">
          <HiOutlinePlus className="h-7 w-7 rounded-full bg-darkC2 p-1 text-textC2" />
          <span>Add account</span>
        </button>
        <button
          onClick={() => signOut()}
          className="tablet:w-44 flex w-36 items-center space-x-2 rounded-r-full bg-white py-3 pl-3  hover:bg-darkC"
        >
          <PiSignOutBold className="h-6 w-6" />
          <span>Sign out</span>
        </button>
      </div>
      <div className="flex h-10 items-center space-x-2 text-xs">
        <span>Privacy policy</span>
        <span className="-mt-[3px]"> . </span> <span>Terms of service</span>
      </div>
    </div>
  );
}

export default UserInfo;
