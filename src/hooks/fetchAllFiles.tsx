import { useFileEntries } from "@/hooks/useFileEntries";

export const useFetchAllFiles = (userId: string, userEmail?: string) => {
  void userEmail;
  return useFileEntries(userId);
};
