import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";
import { getServerAuthSession } from "@/server/auth";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const session = await getServerAuthSession({ req, res });
  if (!session?.user.id) return res.status(401).json({ error: "Unauthorized" });

  const folder = `google-drive-clone/${session.user.id}`;
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: "Cloudinary is not configured." });
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
