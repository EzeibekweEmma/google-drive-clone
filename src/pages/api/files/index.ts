import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { USER_STORAGE_LIMIT_BYTES } from "@/constants/storage";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { serializeFileEntry } from "@/server/files";

const readString = (value: unknown, maxLength = 500) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerAuthSession({ req, res });
  const ownerId = session?.user.id;
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const entries = await db.fileEntry.findMany({
      where: { ownerId },
      orderBy: { createdAt: "asc" },
    });
    return res.status(200).json(entries.map(serializeFileEntry));
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as Record<string, unknown>;
  const isFolder = body.isFolder === true;
  const name = readString(isFolder ? body.folderName : body.fileName, 255);
  const folderId = readString(body.folderId, 191);
  const fileSize = isFolder
    ? 0
    : Math.max(0, Math.floor(Number(body.fileSize ?? 0)));
  if (!name) return res.status(400).json({ error: "A name is required." });
  if (!Number.isSafeInteger(fileSize)) {
    return res.status(400).json({ error: "Invalid file size." });
  }

  if (folderId) {
    const parent = await db.fileEntry.findFirst({
      where: { id: folderId, ownerId, isFolder: true },
      select: { id: true },
    });
    if (!parent)
      return res.status(400).json({ error: "Destination folder not found." });
  }

  if (!isFolder) {
    const usage = await db.fileEntry.aggregate({
      where: { ownerId, isFolder: false },
      _sum: { fileSize: true },
    });
    if ((usage._sum.fileSize ?? 0) + fileSize > USER_STORAGE_LIMIT_BYTES) {
      return res.status(413).json({ error: "Storage limit exceeded." });
    }
  }

  try {
    const entry = await db.fileEntry.create({
      data: {
        name,
        isFolder,
        folderId,
        ownerId,
        fileLink: isFolder ? "" : readString(body.fileLink, 2048),
        publicId: isFolder ? "" : readString(body.publicId, 500),
        resourceType: isFolder
          ? "raw"
          : readString(body.resourceType, 20) || "raw",
        fileSize,
      },
    });
    return res.status(201).json(serializeFileEntry(entry));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ error: "An item with this name already exists." });
    }
    throw error;
  }
}
