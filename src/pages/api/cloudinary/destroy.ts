import type { NextApiRequest, NextApiResponse } from "next";

import { getServerAuthSession } from "@/server/auth";
import { destroyCloudinaryAsset } from "@/server/cloudinary";
import { db } from "@/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  const session = await getServerAuthSession({ req, res });
  if (!session?.user.id) return res.status(401).json({ error: "Unauthorized" });

  const body = req.body as Record<string, unknown>;
  const publicId =
    typeof body.publicId === "string" ? body.publicId.trim() : "";
  const resourceType =
    typeof body.resourceType === "string" ? body.resourceType.trim() : "raw";
  const expectedPrefix = `google-drive-clone/${session.user.id}/`;
  if (!publicId.startsWith(expectedPrefix)) {
    return res
      .status(403)
      .json({ error: "This asset does not belong to the current user." });
  }

  const referenceCount = await db.fileEntry.count({ where: { publicId } });
  if (referenceCount > 0) {
    return res.status(200).json({ result: "retained" });
  }

  await destroyCloudinaryAsset(publicId, resourceType);
  return res.status(200).json({ result: "ok" });
}
