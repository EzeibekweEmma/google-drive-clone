import React from "react";

// The AddFolder component displays a pop-up for creating a new folder.
function AddFolder({ setAddNewFolder }: AddNewFolderProps) {
  return (
    // Background overlay for the pop-up
    <div
      onClick={() => setAddNewFolder(false)} // Close the pop-up when clicking outside
      className="bg-darkC2/40 absolute -left-5 -top-20 flex h-screen w-screen items-center justify-center"
    >
      {/* Pop-up form for creating a new folder */}
      <form
        onClick={(e) => {
          e.stopPropagation(); // Prevent clicks inside the form from closing the pop-up
        }}
        className="bg-darkC2 w-96 space-y-6 rounded-xl p-5 shadow-lg shadow-[#bbb]"
      >
        <h2 className="text-2xl">New folder</h2>
        <input
          className="border-textC outline-textC2 w-full rounded-md border py-2 indent-5"
          type="text"
          placeholder="Untitled folder"
        />
        <div className=" text-textC2 flex w-full justify-end space-x-5 pr-3 font-medium">
          <button
            type="button"
            onClick={() => setAddNewFolder(false)}
            className="hover:bg-darkC2 rounded-full px-3 py-2"
          >
            Cancel
          </button>
          <button className="hover:bg-darkC2 rounded-full px-3 py-2">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddFolder;
