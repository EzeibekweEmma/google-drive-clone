import { fetchFiles } from "@/hooks/fetchFiles";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

function Search() {
  const [searchTest, setSearchTest] = useState<string>("");

  const { data: session } = useSession();
  let list = fetchFiles("", session?.user.email!);

  //TODO: Filter the list based on the search text
  const searchList = list.filter((item) => {
    return item.fileName?.toLowerCase().includes(searchTest.toLowerCase());
  });

  console.log(searchList);

  const openFile = (fileLink: string) => {
    window.open(fileLink, "_blank");
  };

  return (
    <form className="relative flex-1">
      <input
        onChange={(e) => setSearchTest(e.target.value)}
        type="text"
        placeholder="Search in Drive"
        className="w-full rounded-full bg-darkC2 px-2 py-[11px] indent-11 duration-500 placeholder:text-textC focus:bg-white focus:shadow-md focus:outline-none"
      />
      <button
        type="submit"
        className="absolute left-2 top-[5px] h-9 w-9 rounded-full p-2 hover:bg-darkC"
      >
        <AiOutlineSearch className="h-full w-full stroke-textC" stroke="2" />
      </button>
      <button type="submit" hidden />
    </form>
  );
}

export default Search;
