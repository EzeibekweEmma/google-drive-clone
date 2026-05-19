import { onSnapshot, collection } from "firebase/firestore";
import { database } from "@/firebaseConfig";
import { useEffect, useState } from "react";

const files = collection(database, "files");

const matchesOwner = (
  data: Record<string, unknown>,
  userId: string,
  userEmail?: string | null,
) => {
  return data.userId === userId || (!!userEmail && data.userEmail === userEmail);
};

export const useFetchAllFiles = (userId?: string, userEmail?: string | null) => {
  const [fileList, setFileList] = useState<FileListProps[]>([]);

  useEffect(() => {
    if (userId) {
      onSnapshot(files, (res) => {
        return setFileList(
          res.docs
            .map((doc) => {
              const data = doc.data() as Record<string, unknown>;
              const fileName = data.fileName as string | undefined;
              const fileExtension = fileName
                ?.split(".")
                .pop()
                ?.toLowerCase();
              return {
                ...data,
                id: doc.id,
                fileName: data.fileName,
                fileExtension: fileExtension,
                fileLink: data.fileLink,
                folderId: data.folderId,
                folderName: data.folderName,
                isFolder: data.isFolder,
                isStarred: data.isStarred,
                isTrashed: data.isTrashed,
                fileSize: data.fileSize,
                isShared: data.isShared,
                shareToken: data.shareToken,
              };
            })
            .filter((file) => matchesOwner(file, userId, userEmail)) as FileListProps[],
        );
      });
    }
  }, [userEmail, userId]);

  return fileList;
};
