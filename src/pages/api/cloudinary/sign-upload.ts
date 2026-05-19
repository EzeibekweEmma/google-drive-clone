import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";

type ResponseData =
  | {
      signature: string;
      timestamp: number;
      apiKey: string;
      cloudName: string;
    }
  | {
      error: string;
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const folder =
    typeof req.body?.folder === "string" && req.body.folder.trim().length > 0
      ? req.body.folder.trim()
      : null;
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: "Cloudinary is not configured." });
  }

  if (!folder) {
    return res.status(400).json({ error: "Folder is required." });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(signatureBase)
    .digest("hex");

  return res.status(200).json({
    signature,
    timestamp,
    apiKey,
    cloudName,
  });
}
