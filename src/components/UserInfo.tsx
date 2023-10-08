import React from "react";
import {
  ArrowRightOnRectangleIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

type UserInfoProps = {
  setDisplayUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
};

function UserInfo({ setDisplayUserInfo }: UserInfoProps) {
  const { data: session } = useSession();
  return (
    <div className="relative flex flex-col items-center justify-center space-y-3 rounded-2xl bg-[#EDF2FC] px-5 py-3 text-sm font-medium text-[#444746] shadow-md shadow-[#b4bebb]">
      <button
        onClick={() => setDisplayUserInfo((prev: boolean) => false)}
        className="absolute right-3 top-3 rounded-full bg-[#EDF2FC] p-1 hover:bg-[#E1E5EA]"
      >
        <XMarkIcon className="h-6 w-6 rounded-full stroke-2 text-[#444746]" />
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
      <h2 className="text-2xl font-normal">Hi, {session?.user.name}!</h2>
      <button className="rounded-full border border-black px-7 py-2 text-[#4285F4] hover:bg-[#d3dfee]">
        Manage your Google Account
      </button>
      <div className="flex space-x-1">
        <button className="flex w-44 items-center space-x-2 rounded-l-full bg-white py-4 pl-3  hover:bg-[#E1E5EA]">
          <PlusIcon className="h-5 w-5 rounded-full bg-[#EDF2FC] stroke-2 text-[#4285F4]" />
          <span>Add account</span>
        </button>
        <button
          onClick={() => signOut()}
          className="flex w-44 items-center space-x-2 rounded-r-full bg-white py-4 pl-3  hover:bg-[#E1E5EA]"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 stroke-2" />
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
