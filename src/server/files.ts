import type { FileEntry } from "@prisma/client";

export const serializeFileEntry = (entry: FileEntry) => ({
  id: entry.id,
  folderName: entry.isFolder ? entry.name : "",
  isFolder: entry.isFolder,
  fileLink: entry.fileLink,
  fileName: entry.isFolder ? "" : entry.name,
  fileExtension: entry.isFolder
    ? ""
    : (entry.name.split(".").pop()?.toLowerCase() ?? ""),
  isStarred: entry.isStarred,
  isTrashed: entry.isTrashed,
  folderId: entry.folderId,
  userId: entry.ownerId,
  publicId: entry.publicId,
  resourceType: entry.resourceType,
  fileSize: entry.fileSize,
  isShared: entry.isShared,
  shareToken: entry.shareToken ?? "",
});

export const collectDescendantIds = (
  parentId: string,
  entries: Pick<FileEntry, "id" | "folderId">[],
) => {
  const ids: string[] = [];
  const stack = [parentId];
  while (stack.length > 0) {
    const currentId = stack.pop();
    for (const child of entries.filter(
      (entry) => entry.folderId === currentId,
    )) {
      ids.push(child.id);
      stack.push(child.id);
    }
  }
  return ids;
};
