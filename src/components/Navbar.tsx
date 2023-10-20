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
        className="tablet:justify-normal tablet:space-x-3 tablet:px-4 tablet:py-1.5 flex items-center justify-center rounded-full p-2 hover:bg-darkC"
      >
        <DiGoogleDrive className="tablet:h-5 tablet:w-5 h-6 w-6 rounded-sm border-[2.3px] border-textC" />
        <span className="tablet:block hidden">My Drive</span>
      </Link>
      <Link
        href={"/drive/starred"}
        className="tablet:justify-normal tablet:space-x-3 tablet:px-4 tablet:py-1.5 flex items-center justify-center rounded-full p-2 hover:bg-darkC"
      >
        <MdStarBorder className="tablet:h-5 tablet:w-5 h-6 w-6" />
        <span className="tablet:block hidden">Starred</span>
      </Link>
      <Link
        href={"/drive/trash"}
        className="tablet:justify-normal tablet:space-x-3 tablet:px-4 tablet:py-1.5 flex items-center justify-center rounded-full p-2 hover:bg-darkC"
      >
        <RiDeleteBin6Line className="tablet:h-5 tablet:w-5 h-6 w-6" />
        <span className="tablet:block hidden">Bin</span>
      </Link>
    </nav>
  );
}

export default Navbar;
