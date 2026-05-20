import { renameFile } from "@/API/Firestore";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

// The Rename component displays a pop-up for rename input.
function Rename({
  setRenameToggle,
  fileId,
  fileName,
  isFolder,
  fileExtension,
}: renameProps) {
  const [newName, setNewName] = useState(fileName);
  const { data: session } = useSession();

  const rename = async () => {
    // Check if the file name is empty
    if (newName === "") return;
    if (!session?.user.id) return;

    let renamed = false;
    if (isFolder) {
      renamed = await renameFile(
        fileId,
        newName,
        isFolder,
        session.user.id,
        session.user.email,
      );
    } else {
      const formatName = newName.includes(".")
        ? newName
        : newName + "." + fileExtension;
      renamed = await renameFile(
        fileId,
        formatName,
        isFolder,
        session.user.id,
        session.user.email,
      );
    }
    if (renamed) {
      setRenameToggle("");
    }
  };

  return (
    <div className="absolute top-9 z-10 space-y-2 rounded-xl bg-white p-3 shadow-lg shadow-[#bbb]">
      <h2 className="text-xl">Rename</h2>
      <input
        className="w-full rounded-md border border-textC py-1.5 indent-2 outline-textC2"
        type="text"
        placeholder="Rename"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <div className=" flex w-full justify-between  font-medium text-textC2">
        <button
          type="button"
          onClick={() => setRenameToggle("")}
          className="rounded-full px-3 py-2 hover:bg-darkC2"
        >
          Cancel
        </button>
        <button
          onClick={() => void rename()}
          className={`rounded-full px-3 py-2 ${newName && "hover:bg-darkC2"}`}
        >
          Rename
        </button>
      </div>
    </div>
  );
}

export default Rename;
