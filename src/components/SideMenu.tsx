"use client";
import React, { useState, useEffect } from "react";
import { HiOutlinePlusSm } from "react-icons/hi";
import DropDown from "./DropDown";
import AddFolder from "./AddFolder";
import Navbar from "./Navbar";

function PopUp({ isOpen, onClose, setAddNewFolder }: PopUpProps) {
  // Handle clicks outside the pop-up to close it
  const handleOutsideClick = (e: MouseEvent) => {
    if (isOpen && !(e.target as Element).closest(".popup-content")) {
      onClose();
    }
  };

  // Attach and remove the event listener when the component mounts and unmounts
  useEffect(() => {
    window.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`popup ${isOpen ? "open" : ""}`}>
      <div className="popup-content">
        {isOpen && <DropDown setAddNewFolder={setAddNewFolder} />}
      </div>
    </div>
  );
}

function SideMenu() {
  const [DropDown, setDropDown] = useState(false);
  const [addNewFolder, setAddNewFolder] = useState(false);

  // Function to open the pop-up
  const openPopUp = () => {
    setDropDown(true);
  };

  // Function to close the pop-up
  const closePopUp = () => {
    setDropDown(false);
  };

  return (
    <section className="relative w-60 space-y-4">
      <button
        onClick={openPopUp}
        className="hover:bg-darkC2 text-textC mt-1 flex w-fit
      items-center justify-center space-x-2 rounded-2xl bg-white px-5
      py-4 shadow-md shadow-[#ddd] duration-300 hover:shadow-[#bbb]"
      >
        <HiOutlinePlusSm className="h-6 w-6" />
        <span className="text-sm font-medium">New</span>
      </button>
      {/* Add new file or folder drop down */}
      <PopUp
        isOpen={DropDown}
        onClose={closePopUp}
        setAddNewFolder={setAddNewFolder}
      />
      {/* New folder */}
      {addNewFolder && <AddFolder setAddNewFolder={setAddNewFolder} />}

      {/* navbar */}
      <Navbar />
    </section>
  );
}

export default SideMenu;
