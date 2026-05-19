import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "@/env.mjs";

type ResponseData =
  | {
      result: string;
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

  const publicId =
    typeof req.body?.publicId === "string" ? req.body.publicId.trim() : "";
  const resourceType =
    typeof req.body?.resourceType === "string"
      ? req.body.resourceType.trim()
      : "raw";
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({ error: "Cloudinary is not configured." });
  }

  if (!publicId) {
    return res.status(400).json({ error: "publicId is required." });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureBase = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(signatureBase)
    .digest("hex");

  const formData = new URLSearchParams();
  formData.set("public_id", publicId);
  formData.set("api_key", apiKey);
  formData.set("timestamp", String(timestamp));
  formData.set("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    },
  );

  if (!response.ok) {
    return res.status(500).json({ error: "Unable to delete asset." });
  }

  const result = (await response.json()) as { result?: string };
  return res.status(200).json({ result: result.result ?? "ok" });
}
