import { useEffect, useState } from "react";

import { getFiles } from "@/API/Files";

let cache: FileListProps[] | null = null;
let cacheOwnerId = "";
let inFlight: { ownerId: string; promise: Promise<FileListProps[]> } | null =
  null;
const subscribers = new Set<(entries: FileListProps[]) => void>();

const publish = (entries: FileListProps[]) => {
  cache = entries;
  subscribers.forEach((subscriber) => subscriber(entries));
};

const refresh = (ownerId: string) => {
  if (inFlight?.ownerId === ownerId) return inFlight.promise;
  const promise = getFiles()
    .then((entries) => {
      if (cacheOwnerId === ownerId) publish(entries);
      return entries;
    })
    .finally(() => {
      if (inFlight?.promise === promise) inFlight = null;
    });
  inFlight = { ownerId, promise };
  return promise;
};

export const useFileEntries = (ownerId: string) => {
  const [entries, setEntries] = useState<FileListProps[]>(
    cacheOwnerId === ownerId ? (cache ?? []) : [],
  );

  useEffect(() => {
    if (!ownerId) {
      setEntries([]);
      return;
    }

    if (cacheOwnerId !== ownerId) {
      cacheOwnerId = ownerId;
      cache = null;
      setEntries([]);
    }
    subscribers.add(setEntries);
    if (cache) setEntries(cache);
    void refresh(ownerId).catch(console.error);

    const handleChange = () => void refresh(ownerId).catch(console.error);
    window.addEventListener("drive-files-changed", handleChange);
    const interval = window.setInterval(handleChange, 10000);

    return () => {
      subscribers.delete(setEntries);
      window.removeEventListener("drive-files-changed", handleChange);
      window.clearInterval(interval);
    };
  }, [ownerId]);

  return entries;
};
