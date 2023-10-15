import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MdMovie } from "react-icons/md";
import { BiSolidImageAlt } from "react-icons/bi";
import { IoIosArrowDown, IoMdCheckmarkCircle } from "react-icons/io";

function ProgressIndicator({ progress, fileName }: ProgressIndicatorProps) {
  return (
    <div className="absolute bottom-0 w-screen">
      <div className="shadow-textC absolute -bottom-5 right-10 w-[23rem] overflow-hidden rounded-t-2xl shadow-sm">
        <div className="bg-bgc flex items-center justify-between py-2 pl-4 pr-2">
          <h3 className="text-textC font-medium">2 uploads complete</h3>
          <div className="flex items-center">
            <div className="hover:bg-darkC h-9 w-9 cursor-pointer rounded-full p-2">
              <IoIosArrowDown className="h-full w-full" stroke="2" />
            </div>
            <div className="hover:bg-darkC h-9 w-9 cursor-pointer rounded-full p-2">
              <AiOutlineClose className="h-full w-full" />
            </div>
          </div>
          {/* uploaded files progress */}
        </div>
        <div>
          <div className="flex items-center justify-between bg-white py-2.5 pl-4 pr-2 hover:bg-[#eee]">
            <div className="flex items-center space-x-3">
              <BiSolidImageAlt className="h-6 w-6 text-[#CA2E24]" />
              <span className="truncate">{fileName}</span>
            </div>
            {progress < 100 ? (
              <span className="pr-2">{progress}%</span>
            ) : (
              <IoMdCheckmarkCircle className="h-8 w-8 pr-2 text-green-600" />
            )}

            {/* <div className="hover:bg-darkC h-9 w-9 cursor-pointer rounded-full p-2">
              <IoMdCheckmarkCircle className="h-full w-full" />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressIndicator;
