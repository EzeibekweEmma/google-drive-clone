import Head from "next/head";
import Image from "next/image";
import type { GetServerSideProps } from "next";

import fileIcons from "@/components/fileIcons";
import { db } from "@/server/db";
import { serializeFileEntry } from "@/server/files";

function SharedFilePage({ file }: { file: FileListProps | null }) {
  const renderPreview = () => {
    if (!file) return null;

    if (
      ["jpg", "jpeg", "png", "gif", "webp", "ico", "jfif"].includes(
        file.fileExtension,
      )
    ) {
      return (
        <div className="relative h-[24rem] w-full overflow-hidden rounded-2xl bg-darkC2">
          <Image
            src={file.fileLink}
            alt={file.fileName}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>
      );
    }

    if (file.fileExtension === "mp4") {
      return (
        <video controls className="max-h-[24rem] w-full rounded-2xl bg-black">
          <source src={file.fileLink} />
        </video>
      );
    }

    if (file.fileExtension === "mp3") {
      return (
        <div className="rounded-2xl bg-darkC2 p-6">
          <audio controls className="w-full">
            <source src={file.fileLink} type="audio/mpeg" />
          </audio>
        </div>
      );
    }

    const icon =
      fileIcons[file.fileExtension as keyof typeof fileIcons] ?? fileIcons.any;

    return (
      <div className="flex min-h-[24rem] flex-col items-center justify-center rounded-2xl bg-darkC2 p-8 text-textC">
        <div className="mb-4 h-28 w-28">{icon}</div>
        <p className="text-sm text-textC/70">
          Preview is not available for this file type.
        </p>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>{file ? `${file.fileName} - Shared File` : "Shared File"}</title>
      </Head>
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-5 py-10">
        <div className="w-full rounded-[2rem] bg-white p-6 shadow-sm shadow-[#d7dce5]">
          {!file ? (
            <div className="flex min-h-[20rem] flex-col items-center justify-center text-center text-textC">
              <h1 className="mb-2 text-2xl font-medium">
                This file is unavailable
              </h1>
              <p className="text-sm text-textC/70">
                The share link may be invalid or sharing may have been turned
                off.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.2em] text-textC/50">
                  Shared file
                </p>
                <h1 className="text-3xl font-medium text-textC">
                  {file.fileName}
                </h1>
              </div>
              {renderPreview()}
              <div className="flex flex-wrap gap-3">
                <a
                  href={file.fileLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#1a73e8] px-5 py-2.5 font-medium text-white hover:bg-[#1557b0]"
                >
                  Open file
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{
  file: FileListProps | null;
}> = async ({ params }) => {
  const token = typeof params?.token === "string" ? params.token : "";
  const entry = token
    ? await db.fileEntry.findFirst({
        where: {
          shareToken: token,
          isShared: true,
          isFolder: false,
          isTrashed: false,
        },
      })
    : null;

  const file = entry
    ? { ...serializeFileEntry(entry), userId: undefined, userEmail: undefined }
    : null;
  return { props: { file } };
};

export default SharedFilePage;
