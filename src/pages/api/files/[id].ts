import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

import { USER_STORAGE_LIMIT_BYTES } from "@/constants/storage";
import { getServerAuthSession } from "@/server/auth";
import { destroyCloudinaryAsset } from "@/server/cloudinary";
import { db } from "@/server/db";
import { collectDescendantIds, serializeFileEntry } from "@/server/files";

const readString = (value: unknown, maxLength = 500) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const destinationIsValid = async (ownerId: string, destinationId: string) => {
  if (!destinationId) return true;
  const folder = await db.fileEntry.findFirst({
    where: { id: destinationId, ownerId, isFolder: true },
    select: { id: true },
  });
  return Boolean(folder);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerAuthSession({ req, res });
  const ownerId = session?.user.id;
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!ownerId) return res.status(401).json({ error: "Unauthorized" });
  if (!id) return res.status(400).json({ error: "File id is required." });

  const entry = await db.fileEntry.findFirst({ where: { id, ownerId } });
  if (!entry) return res.status(404).json({ error: "Item not found." });

  if (req.method === "DELETE") {
    const allEntries = await db.fileEntry.findMany({ where: { ownerId } });
    const targetIds = [id];
    if (entry.isFolder) targetIds.push(...collectDescendantIds(id, allEntries));
    const targets = allEntries.filter((item) => targetIds.includes(item.id));
    const assets = new Map<string, string>();
    targets.forEach((item) => {
      if (!item.isFolder && item.publicId)
        assets.set(item.publicId, item.resourceType);
    });

    if (assets.size > 0) {
      const references = await db.fileEntry.findMany({
        where: {
          publicId: { in: [...assets.keys()] },
          id: { notIn: targetIds },
        },
        select: { publicId: true },
      });
      const retained = new Set(references.map((item) => item.publicId));
      for (const [publicId, resourceType] of assets) {
        if (!retained.has(publicId))
          await destroyCloudinaryAsset(publicId, resourceType);
      }
    }

    await db.fileEntry.deleteMany({
      where: { id: { in: targetIds }, ownerId },
    });
    return res.status(204).end();
  }

  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as Record<string, unknown>;
  const action = readString(body.action, 30);
  try {
    if (action === "rename") {
      const name = readString(body.name, 255);
      if (!name) return res.status(400).json({ error: "A name is required." });
      const updated = await db.fileEntry.update({
        where: { id },
        data: { name },
      });
      return res.status(200).json(serializeFileEntry(updated));
    }

    if (action === "star") {
      const updated = await db.fileEntry.update({
        where: { id },
        data: { isStarred: body.isStarred === true },
      });
      return res.status(200).json(serializeFileEntry(updated));
    }

    if (action === "trash") {
      const isTrashed = body.isTrashed === true;
      const updated = await db.fileEntry.update({
        where: { id },
        data: { isTrashed, ...(isTrashed ? { isStarred: false } : {}) },
      });
      return res.status(200).json(serializeFileEntry(updated));
    }

    if (action === "share") {
      if (entry.isFolder)
        return res
          .status(400)
          .json({ error: "Folder sharing is not supported." });
      const isShared = body.isShared === true;
      const shareToken = isShared ? readString(body.shareToken, 191) : null;
      if (isShared && !shareToken) {
        return res.status(400).json({ error: "A share token is required." });
      }
      const updated = await db.fileEntry.update({
        where: { id },
        data: { isShared, shareToken },
      });
      return res.status(200).json(serializeFileEntry(updated));
    }

    if (action === "move") {
      const destinationId = readString(body.destinationId, 191);
      if (!(await destinationIsValid(ownerId, destinationId))) {
        return res.status(400).json({ error: "Destination folder not found." });
      }
      if (entry.isFolder) {
        const allEntries = await db.fileEntry.findMany({ where: { ownerId } });
        const descendants = new Set(collectDescendantIds(id, allEntries));
        if (destinationId === id || descendants.has(destinationId)) {
          return res
            .status(400)
            .json({ error: "A folder cannot be moved into itself." });
        }
      }
      const updated = await db.fileEntry.update({
        where: { id },
        data: { folderId: destinationId, isTrashed: false },
      });
      return res.status(200).json(serializeFileEntry(updated));
    }

    if (action === "copy") {
      const destinationId = readString(body.destinationId, 191);
      if (!(await destinationIsValid(ownerId, destinationId))) {
        return res.status(400).json({ error: "Destination folder not found." });
      }
      const allEntries = await db.fileEntry.findMany({ where: { ownerId } });
      const sourceIds = entry.isFolder
        ? [id, ...collectDescendantIds(id, allEntries)]
        : [id];
      const sources = allEntries.filter((item) => sourceIds.includes(item.id));
      const copySize = sources.reduce(
        (total, item) => total + (item.isFolder ? 0 : item.fileSize),
        0,
      );
      const usage = allEntries.reduce(
        (total, item) => total + (item.isFolder ? 0 : item.fileSize),
        0,
      );
      if (usage + copySize > USER_STORAGE_LIMIT_BYTES) {
        return res.status(413).json({ error: "Storage limit exceeded." });
      }

      const created = await db.$transaction(async (tx) => {
        const idMap = new Map<string, string>();
        const pending = [...sources];
        let rootCopy = null;
        while (pending.length > 0) {
          const index = pending.findIndex(
            (item) => item.id === id || idMap.has(item.folderId),
          );
          if (index === -1) throw new Error("Invalid folder hierarchy.");
          const [source] = pending.splice(index, 1);
          if (!source) continue;
          const copy = await tx.fileEntry.create({
            data: {
              name: source.name,
              isFolder: source.isFolder,
              fileLink: source.fileLink,
              isStarred: source.isStarred,
              isTrashed: false,
              folderId:
                source.id === id
                  ? destinationId
                  : (idMap.get(source.folderId) ?? destinationId),
              publicId: source.publicId,
              resourceType: source.resourceType,
              fileSize: source.fileSize,
              ownerId,
            },
          });
          idMap.set(source.id, copy.id);
          if (source.id === id) rootCopy = copy;
        }
        return rootCopy;
      });
      if (!created) throw new Error("Unable to copy item.");
      return res.status(201).json(serializeFileEntry(created));
    }

    return res.status(400).json({ error: "Unknown action." });
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
