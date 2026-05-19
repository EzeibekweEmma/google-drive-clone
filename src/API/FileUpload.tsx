import { storage } from "@/firebaseConfig";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { addFiles } from "@/API/Firestore";

const fileUpload = (
  file: any,
  setProgress: Function,
  parentId: string,
  userId: string,
  userEmail?: string,
) => {
  const safeName = `${crypto.randomUUID()}-${file.name}`;
  const storageRef = ref(storage, `files/${userId}/${safeName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      );
      // TODO: add progress bar
      setProgress((prev: number[]) => [...prev, { [file.name]: progress }]);
    },
    (error) => {
      alert(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        addFiles(downloadURL, file.name, parentId, userId, userEmail);
      });
    },
  );
};

export default fileUpload;
