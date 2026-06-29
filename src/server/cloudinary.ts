import crypto from "crypto";

import { env } from "@/env.mjs";

export const destroyCloudinaryAsset = async (
  publicId: string,
  resourceType = "raw",
) => {
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = env.CLOUDINARY_API_KEY;
  const apiSecret = env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured.");
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const signatureBase = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(signatureBase)
    .digest("hex");
  const body = new URLSearchParams({
    public_id: publicId,
    api_key: apiKey,
    timestamp: String(timestamp),
    signature,
  });
  const type = ["image", "video", "raw"].includes(resourceType)
    ? resourceType
    : "raw";
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${type}/destroy`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );
  if (!response.ok) throw new Error("Unable to delete Cloudinary asset.");
};
