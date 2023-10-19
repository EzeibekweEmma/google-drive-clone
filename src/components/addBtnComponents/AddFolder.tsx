import React from "react";

// The AddFolder component displays a pop-up for creating a new folder.
function AddFolder({
  setFolderToggle,
  setFolderName,
  uploadFolder,
}: folderToggleProps) {
  const addFolder = () => {
    uploadFolder();
    setFolderToggle(false);
  };

  return (
    // Background overlay for the pop-up
    <div
      onClick={() => setFolderToggle(false)} // Close the pop-up when clicking outside
      className="absolute -left-5 -top-20 z-20 flex h-screen w-screen items-center justify-center bg-darkC2/40"
    >
      {/* Pop-up form for creating a new folder */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // Prevent clicks inside the form from closing the pop-up
        }}
        className="w-96 space-y-6 rounded-xl bg-white p-5 shadow-lg shadow-[#bbb]"
      >
        <h2 className="text-2xl">New folder</h2>
        <input
          className="w-full rounded-md border border-textC py-2 indent-5 outline-textC2"
          type="text"
          placeholder="Untitled folder"
          onChange={(e) => setFolderName(e.target.value)}
        />
        <div className=" flex w-full justify-end space-x-5 pr-3 font-medium text-textC2">
          <button
            type="button"
            onClick={() => setFolderToggle(false)}
            className="rounded-full px-3 py-2 hover:bg-darkC2"
          >
            Cancel
          </button>
          <button
            onClick={() => addFolder()}
            className="rounded-full px-3 py-2 hover:bg-darkC2"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddFolder;
