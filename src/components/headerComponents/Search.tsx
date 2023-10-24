import { fetchAllFiles } from "@/hooks/fetchAllFiles";
import { useSession } from "next-auth/react";
import React, { useState, useEffect, useRef } from "react";
import { AiFillFolder, AiOutlineSearch } from "react-icons/ai";
import fileIcons from "../fileIcons";
import { useRouter } from "next/router";

function Search() {
  const [searchTest, setSearchTest] = useState<string>("");
  const [onFocus, setOnFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: session } = useSession();
  let list = fetchAllFiles(session?.user.email!);

  const router = useRouter();

  const openFile = (fileLink: string) => {
    // Function to open a file in a new tab.
    window.open(fileLink, "_blank");
  };

  const searchList = list.filter((item) => {
    // Filter files and folders based on the search text.
    return (
      (item.fileName?.toLowerCase().includes(searchTest.toLowerCase()) &&
        searchTest &&
        !item?.isTrashed) ||
      (item.folderName?.toLowerCase().includes(searchTest.toLowerCase()) &&
        searchTest &&
        !item?.isTrashed)
    );
  });

  const result = searchList.map((item) => {
    // Create a list of search results.
    const icon =
      fileIcons[item.fileExtension as keyof typeof fileIcons] ??
      fileIcons["any"];
    return (
      <div
        onClick={() => {
          item.isFolder
            ? router.push("/drive/folders/" + item.id)
            : openFile(item.fileLink);
        }}
        className="flex w-full cursor-pointer items-center space-x-3.5 border-blue-700 px-4 py-2 hover:border-l-2 hover:bg-darkC2"
      >
        <span className="h-6 w-6">
          {item.isFolder ? (
            <AiFillFolder className="h-full w-full text-textC" />
          ) : (
            icon
          )}
        </span>
        <span className="w-full truncate">
          {item.fileName || item.folderName}
        </span>
      </div>
    );
  });

  // Event handler for the onClick event on the document
  const handleDocumentClick = (e: { target: any }) => {
    if (
      inputRef.current &&
      e.target &&
      !inputRef.current.contains(e.target as Node)
    ) {
      setOnFocus(false);
    }
  };

  // Attach a click event listener to the document
  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="relative flex-1" onFocus={() => setOnFocus(true)}>
      <span className="absolute left-2 top-[5px] h-9 w-9 cursor-pointer rounded-full p-2 hover:bg-darkC">
        <AiOutlineSearch className="h-full w-full stroke-textC" stroke="2" />
      </span>

      <input
        ref={inputRef}
        onChange={(e) => setSearchTest(e.target.value)}
        type="text"
        placeholder="Search in Drive"
        className="w-full rounded-full bg-darkC2 px-2 py-[11px] indent-11 shadow-darkC
        placeholder:text-textC focus:rounded-b-none
        focus:rounded-t-2xl focus:bg-white focus:shadow-md focus:outline-none"
      />
      {onFocus && (
        <div
          className="absolute z-10 max-h-60 w-full overflow-scroll rounded-b-2xl border-t-[1.5px]
      border-textC bg-white pt-2 shadow-md shadow-darkC"
        >
          {result.length < 1 && searchTest ? (
            <div className="pl-5 text-sm text-gray-500">
              No result match your search.
            </div>
          ) : (
            result
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
