import { database } from "@/firebaseConfig";
import { formatBytes } from "@/utils/formatBytes";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";

const files = collection(database, "files");
export const USER_STORAGE_LIMIT_BYTES = 200 * 1024 * 1024;

const matchesOwner = (
  data: Record<string, unknown>,
  userId: string,
  userEmail?: string | null,
) => {
  return data.userId === userId || (!!userEmail && data.userEmail === userEmail);
};

const getOwnedEntries = async (userId: string, userEmail?: string | null) => {
  const snapshot = await getDocs(files);

  return snapshot.docs.filter((entry) =>
    matchesOwner(entry.data() as Record<string, unknown>, userId, userEmail),
  );
};

const getEntryName = (
  entry: QueryDocumentSnapshot<DocumentData> | FileListProps,
  isFolder: boolean,
) => {
  const data = "data" in entry ? entry.data() : entry;
  return isFolder ? (data.folderName as string) : (data.fileName as string);
};

const findConflictEntry = (
  entries: Array<QueryDocumentSnapshot<DocumentData> | FileListProps>,
  options: {
    destinationId: string;
    isFolder: boolean;
    name: string;
    userId: string;
    userEmail?: string | null;
    excludeId?: string;
  },
) => {
  return entries.find((entry) => {
    const data = "data" in entry ? entry.data() : entry;
    const entryId = "data" in entry ? entry.id : entry.id;

    return (
      (data.userId === options.userId ||
        (!!options.userEmail && data.userEmail === options.userEmail)) &&
      data.folderId === options.destinationId &&
      data.isFolder === options.isFolder &&
      getEntryName(entry, options.isFolder) === options.name &&
      entryId !== options.excludeId
    );
  });
};

export const addFiles = (
  fileLink: string,
  fileName: string,
  folderId: string,
  userId: string,
  userEmail?: string,
  publicId?: string,
  resourceType?: string,
  fileSize?: number,
) => {
  try {
    return addDoc(files, {
      fileLink: fileLink,
      fileName: fileName,
      isFolder: false,
      isStarred: false,
      isTrashed: false,
      folderId: folderId,
      userId: userId,
      userEmail: userEmail ?? "",
      publicId: publicId ?? "",
      resourceType: resourceType ?? "raw",
      fileSize: fileSize ?? 0,
      isShared: false,
      shareToken: "",
    });
  } catch (err) {
    console.error(err);
  }
};

export const addFolder = (payload: payloadProps) => {
  try {
    return addDoc(files, {
      isShared: false,
      shareToken: "",
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
  userId: string,
  userEmail?: string,
) => {
  const fileRef = doc(files, fileId);
  try {
    const ownedEntries = await getOwnedEntries(userId, userEmail);
    const currentEntry = ownedEntries.find((entry) => entry.id === fileId);

    if (!currentEntry) return false;

    const currentData = currentEntry.data();
    const conflict = findConflictEntry(ownedEntries, {
      destinationId: (currentData.folderId as string) ?? "",
      isFolder,
      name: newName,
      userId,
      userEmail,
      excludeId: fileId,
    });

    if (conflict) {
      const confirmed = window.confirm(
        `"${newName}" already exists here. Replace it?`,
      );

      if (!confirmed) return false;

      const conflictData = "data" in conflict ? conflict.data() : conflict;
      await deleteFile(
        conflict.id,
        !!conflictData.isFolder,
        conflictData.publicId as string | undefined,
        conflictData.resourceType as string | undefined,
      );
    }

    await updateDoc(fileRef, {
      [isFolder ? "folderName" : "fileName"]: newName,
    });
    return true;
  } catch (error) {
    console.error("Error updating file properties: ", error);
    return false;
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

export const updateShareSettings = async (
  fileId: string,
  isShared: boolean,
  shareToken = "",
) => {
  const fileRef = doc(files, fileId);
  try {
    await updateDoc(fileRef, {
      isShared,
      shareToken: isShared ? shareToken : "",
    });
  } catch (error) {
    console.error("Error updating share settings: ", error);
    throw error;
  }
};

const destroyCloudinaryAsset = async (
  publicId?: string,
  resourceType?: string,
) => {
  if (!publicId) return;

  const response = await fetch("/api/cloudinary/destroy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publicId,
      resourceType: resourceType ?? "raw",
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to delete Cloudinary asset.");
  }
};

const destroyAssetIfUnused = async (
  publicId: string,
  resourceType: string | undefined,
  ignoreIds: Set<string>,
) => {
  const refs = await getDocs(query(files, where("publicId", "==", publicId)));
  const activeRefs = refs.docs.filter((entry) => !ignoreIds.has(entry.id));

  if (activeRefs.length === 0) {
    await destroyCloudinaryAsset(publicId, resourceType);
  }
};

const collectFolderDescendants = (
  parentId: string,
  entries: QueryDocumentSnapshot<DocumentData>[],
) => {
  const descendants: QueryDocumentSnapshot<DocumentData>[] = [];
  const stack = [parentId];

  while (stack.length > 0) {
    const currentId = stack.pop();
    const children = entries.filter((entry) => entry.data().folderId === currentId);

    for (const child of children) {
      descendants.push(child);
      if (child.data().isFolder) {
        stack.push(child.id);
      }
    }
  }

  return descendants;
};

export const getUserUsageBytes = async (userId: string, userEmail?: string) => {
  const ownedEntries = await getOwnedEntries(userId, userEmail);

  return ownedEntries.reduce((total, entry) => {
    const data = entry.data();
    if (data.isFolder) return total;
    return total + Number(data.fileSize ?? 0);
  }, 0);
};

export const deleteFile = async (
  fileId: string,
  isFolder: boolean,
  publicId?: string,
  resourceType?: string,
) => {
  const fileRef = doc(files, fileId);
  try {
    const deleteTargets: QueryDocumentSnapshot<DocumentData>[] = [];

    if (isFolder && fileId) {
      const snapshot = await getDocs(files);
      deleteTargets.push(...collectFolderDescendants(fileId, snapshot.docs));
    }

    const ignoreIds = new Set([fileId, ...deleteTargets.map((entry) => entry.id)]);

    if (!isFolder && publicId) {
      await destroyAssetIfUnused(publicId, resourceType, ignoreIds);
    }

    for (const snapshot of deleteTargets) {
      const data = snapshot.data();
      if (!data.isFolder && data.publicId) {
        await destroyAssetIfUnused(
          data.publicId as string,
          data.resourceType as string,
          ignoreIds,
        );
      }
    }

    // Delete the file or folder itself
    await deleteDoc(fileRef);
    await Promise.all(deleteTargets.map((entry) => deleteDoc(entry.ref)));
  } catch (error) {
    console.error("Error deleting file or folder: ", error);
  }
};

export const replaceConflictingEntry = async (
  entry: FileListProps,
) => {
  if (!entry.id) return;

  await deleteFile(entry.id, entry.isFolder, entry.publicId, entry.resourceType);
};

export const moveEntry = async (
  entry: FileListProps,
  destinationId: string,
  userId: string,
  userEmail?: string,
) => {
  const ownedEntries = await getOwnedEntries(userId, userEmail);
  const name = entry.isFolder ? entry.folderName : entry.fileName;
  const conflict = findConflictEntry(ownedEntries, {
    destinationId,
    isFolder: entry.isFolder,
    name,
    userId,
    userEmail,
    excludeId: entry.id,
  });

  if (conflict) {
    const confirmed = window.confirm(
      `"${name}" already exists in the destination. Replace it?`,
    );

    if (!confirmed) return;

    const conflictData = "data" in conflict ? conflict.data() : conflict;
    await deleteFile(
      conflict.id,
      !!conflictData.isFolder,
      conflictData.publicId as string | undefined,
      conflictData.resourceType as string | undefined,
    );
  }

  await updateDoc(doc(files, entry.id), {
    folderId: destinationId,
    isTrashed: false,
  });
};

const copyChildrenRecursively = async (
  sourceId: string,
  destinationId: string,
  ownedEntries: QueryDocumentSnapshot<DocumentData>[],
) => {
  const children = ownedEntries.filter((entry) => entry.data().folderId === sourceId);

  for (const child of children) {
    const data = child.data();

    if (data.isFolder) {
      const newFolder = await addFolder({
        folderName: data.folderName as string,
        isFolder: true,
        FileList: [],
        isStarred: !!data.isStarred,
        isTrashed: !!data.isTrashed,
        folderId: destinationId,
        userId: data.userId as string | undefined,
        userEmail: data.userEmail as string | undefined,
      });

      if (newFolder) {
        await copyChildrenRecursively(child.id, newFolder.id, ownedEntries);
      }
    } else {
      await addFiles(
        data.fileLink as string,
        data.fileName as string,
        destinationId,
        data.userId as string,
        data.userEmail as string | undefined,
        data.publicId as string | undefined,
        data.resourceType as string | undefined,
        Number(data.fileSize ?? 0),
      );
    }
  }
};

const getEntrySizeForCopy = (
  entry: FileListProps,
  ownedEntries: QueryDocumentSnapshot<DocumentData>[],
) => {
  if (!entry.isFolder) return Number(entry.fileSize ?? 0);

  const descendants = collectFolderDescendants(entry.id, ownedEntries);
  return descendants.reduce((total, child) => {
    const data = child.data();
    if (data.isFolder) return total;
    return total + Number(data.fileSize ?? 0);
  }, 0);
};

export const copyEntry = async (
  entry: FileListProps,
  destinationId: string,
  userId: string,
  userEmail?: string,
) => {
  const ownedEntries = await getOwnedEntries(userId, userEmail);
  const currentUsage = await getUserUsageBytes(userId, userEmail);
  const copySize = getEntrySizeForCopy(entry, ownedEntries);

  if (currentUsage + copySize > USER_STORAGE_LIMIT_BYTES) {
    window.alert(`This copy would exceed your ${formatBytes(USER_STORAGE_LIMIT_BYTES)} storage limit.`);
    return;
  }

  const name = entry.isFolder ? entry.folderName : entry.fileName;
  const conflict = findConflictEntry(ownedEntries, {
    destinationId,
    isFolder: entry.isFolder,
    name,
    userId,
    userEmail,
  });

  if (conflict) {
    const confirmed = window.confirm(
      `"${name}" already exists in the destination. Replace it?`,
    );

    if (!confirmed) return;

    const conflictData = "data" in conflict ? conflict.data() : conflict;
    await deleteFile(
      conflict.id,
      !!conflictData.isFolder,
      conflictData.publicId as string | undefined,
      conflictData.resourceType as string | undefined,
    );
  }

  if (entry.isFolder) {
    const newFolder = await addFolder({
      folderName: entry.folderName,
      isFolder: true,
      FileList: [],
      isStarred: entry.isStarred,
      isTrashed: false,
      folderId: destinationId,
      userId,
      userEmail: userEmail ?? "",
    });

    if (newFolder) {
      await copyChildrenRecursively(entry.id, newFolder.id, ownedEntries);
    }

    return;
  }

  await addFiles(
    entry.fileLink,
    entry.fileName,
    destinationId,
    userId,
    userEmail,
    entry.publicId,
    entry.resourceType,
    Number(entry.fileSize ?? 0),
  );
};
