import { database } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

let files = collection(database, "files");

export const addFiles = (
  fileLink: string,
  fileName: string,
  folderId: string,
  userEmail: string,
) => {
  try {
    addDoc(files, {
      fileLink: fileLink,
      fileName: fileName,
      isFolder: false,
      isStarred: false,
      isTrashed: false,
      folderId: folderId,
      userEmail: userEmail,
    });
  } catch (err) {
    console.error(err);
  }
};

export const addFolder = (payload: payloadProps) => {
  try {
    addDoc(files, {
      ...payload,
    });
  } catch (err) {
    console.error(err);
  }
};

export const renameFile = async (fileId: string, fileName: string) => {
  const fileRef = doc(files, fileId);
  try {
    await updateDoc(fileRef, {
      fileName: fileName,
    });
  } catch (error) {
    console.error("Error updating file properties: ", error);
  }
};

export const starFile = async (fileId: string, isStarred: boolean) => {
  const fileRef = doc(files, fileId);
  try {
    await updateDoc(fileRef, {
      isStarred: isStarred,
    });
  } catch (error) {
    console.error("Error updating file properties: ", error);
  }
};

export const trashFile = async (fileId: string, isTrashed: boolean) => {
  const fileRef = doc(files, fileId);
  try {
    await updateDoc(fileRef, {
      isStarred: false,
      isTrashed: isTrashed,
    });
  } catch (error) {
    console.error("Error updating file properties: ", error);
  }
};

export const deleteFile = async (fileId: string) => {
  const fileRef = doc(files, fileId);
  try {
    await deleteDoc(fileRef);
  } catch (error) {
    console.error("Error deleting file: ", error);
  }
};
