import Link from "next/link";
import React from "react";
import { DiGoogleDrive } from "react-icons/di";
import { MdStarBorder } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

function Navbar() {
  return (
    <nav className="space-y-0.5 pr-5">
      <Link
        href={"/drive/my-drive"}
        className="hover:bg-darkC flex items-center space-x-3 rounded-full px-4 py-1.5"
      >
        <DiGoogleDrive className="border-textC h-5 w-5 rounded-sm border-[2.3px]" />
        <span>My Drive</span>
      </Link>
      <Link
        href={"/drive/starred"}
        className="hover:bg-darkC flex items-center space-x-3 rounded-full px-4 py-1.5"
      >
        <MdStarBorder className="h-5 w-5" />
        <span>Starred</span>
      </Link>
      <Link
        href={"/drive/trash"}
        className="hover:bg-darkC flex items-center space-x-3 rounded-full px-4 py-1.5"
      >
        <RiDeleteBin6Line className="h-5 w-5" />
        <span>Bin</span>
      </Link>
    </nav>
  );
}

export default Navbar;
