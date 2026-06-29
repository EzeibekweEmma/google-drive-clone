import { useFileEntries } from "@/hooks/useFileEntries";

export const useFetchFiles = (
  folderId: string,
  userId: string,
  userEmail?: string,
) => {
  void userEmail;
  return useFileEntries(userId).filter((entry) => entry.folderId === folderId);
};
