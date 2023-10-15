import { uploadBytes } from "firebase/storage";
import React from "react";
import { MdUploadFile } from "react-icons/md";
// import fileUpload from "@/API/FileUpload";

function UploadFileBtn({ uploadFile }: { uploadFile: Function }) {
  // const [file, setFile] = useState({});
  // const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   fileUpload(file, setProgress);
  // };
  return (
    <button className="hover:bg-darkC relative flex w-full items-center space-x-3 px-4 py-1.5">
      <MdUploadFile className="h-5 w-5" />
      <input
        type="file"
        onChange={(e) => uploadFile(e)}
        className="absolute -left-3 top-0 h-full w-full cursor-pointer bg-slate-300 opacity-0"
      />
      <span>File upload</span>
    </button>
  );
}

export default UploadFileBtn;
