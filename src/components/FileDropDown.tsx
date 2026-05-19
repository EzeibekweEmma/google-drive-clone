import React from "react";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import {
  MdContentCopy,
  MdDriveFileRenameOutline,
  MdDriveFileMove,
  MdOutlineRestore,
  MdStarBorder,
  MdStarRate,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbDownload } from "react-icons/tb";
import { deleteFile, moveEntry, copyEntry, starFile, trashFile } from "@/API/Firestore";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import TransferDialog from "./TransferDialog";

function FileDropDown({
  file,
  setOpenMenu,
  select,
  isFolderComp,
  folderId,
  setRenameToggle,
}: FileDropDownProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [transferMode, setTransferMode] = React.useState<"move" | "copy" | "">("");
  const closeMenu = () => setOpenMenu("");

  const openFile = (fileLink: string) => {
    // Open the file in a new tab
    window.open(fileLink, "_blank");
  };

  return (
    <>
      <section
        onClick={(event) => event.stopPropagation()}
        className={`absolute top-9 z-10 ${
          select == "trashed" ? "h-fit" : "max-h-72"
        } w-52 overflow-y-auto rounded-md border bg-white shadow-sm shadow-[#777]`}
      >
        {select !== "trashed" ? (
          <>
            <div
              onClick={() => {
                closeMenu();
                isFolderComp
                  ? router.push("/drive/folders/" + folderId)
                  : openFile(file.fileLink);
              }}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <HiOutlineArrowsExpand className="h-5 w-5" />
              <span className="text-sm">Open File</span>
            </div>
            {!isFolderComp && (
              <a
                href={file.fileLink}
                download={file.fileName}
                onClick={closeMenu}
                className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
              >
                <TbDownload className="h-5 w-5" />
                <span className="text-sm">Download</span>
              </a>
            )}

            <div
              onClick={() => {
                closeMenu();
                setRenameToggle(file.id);
              }}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <MdDriveFileRenameOutline className="h-5 w-5" />
              <span className="text-sm">Rename</span>
            </div>
            <div
              onClick={() => {
                closeMenu();
                void starFile(file.id, !file.isStarred);
              }}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              {!file.isStarred ? (
                <MdStarBorder className="h-5 w-5" />
              ) : (
                <MdStarRate className="h-5 w-5" />
              )}
              <span className="text-sm">Add to starred</span>
            </div>
            <div
              onClick={() => setTransferMode("move")}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <MdDriveFileMove className="h-5 w-5" />
              <span className="text-sm">Move to</span>
            </div>
            <div
              onClick={() => setTransferMode("copy")}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <MdContentCopy className="h-5 w-5" />
              <span className="text-sm">Make a copy to</span>
            </div>
            <div
              onClick={() => {
                closeMenu();
                void trashFile(file.id, true);
              }}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <RiDeleteBin6Line className="h-5 w-5" />
              <span className="text-sm">Move to bin</span>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => {
                closeMenu();
                void trashFile(file.id, false);
              }}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <MdOutlineRestore className="h-5 w-5" />
              <span className="text-sm">Restore</span>
            </div>
            <div
              onClick={() => {
                closeMenu();
                void deleteFile(
                  file.id,
                  file.isFolder,
                  file.publicId,
                  file.resourceType,
                );
              }}
              className="my-2 flex items-center space-x-3 px-3 py-1.5 hover:cursor-pointer hover:bg-[#ddd]"
            >
              <RiDeleteBin6Line className="h-5 w-5" />
              <span className="text-sm">Delete forever</span>
            </div>
          </>
        )}
      </section>
      {transferMode && session?.user.id && (
        <TransferDialog
          item={file}
          mode={transferMode}
          onClose={() => {
            setTransferMode("");
            closeMenu();
          }}
          onConfirm={async (destinationId) => {
            if (transferMode === "move") {
              await moveEntry(
                file,
                destinationId,
                session.user.id,
                session.user.email,
              );
              return;
            }

            await copyEntry(file, destinationId, session.user.id, session.user.email);
          }}
        />
      )}
    </>
  );
}

export default FileDropDown;
