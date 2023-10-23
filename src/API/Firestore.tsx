import { database } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
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

export const renameFile = async (
  fileId: string,
  newName: string,
  isFolder: boolean,
) => {
  const fileRef = doc(files, fileId);
  try {
    await updateDoc(fileRef, {
      [isFolder ? "folderName" : "fileName"]: newName,
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

export const deleteFile = async (fileId: string, isFolder: boolean) => {
  const fileRef = doc(files, fileId);
  try {
    // Delete the file or folder itself
    await deleteDoc(fileRef);

    // If it's a folder, also delete all files with the same folderId
    if (isFolder && fileId) {
      const filesQuery = query(files, where("folderId", "==", fileId));
      const querySnapshot = await getDocs(filesQuery);

      const deletePromises: any[] = [];

      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });

      await Promise.all(deletePromises);
    }
  } catch (error) {
    console.error("Error deleting file or folder: ", error);
  }
};
