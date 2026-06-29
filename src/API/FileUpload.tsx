import type { Dispatch, SetStateAction } from "react";
import { addFiles } from "@/API/Files";

const fileUpload = (
  file: File,
  uploadId: string,
  setUploads: Dispatch<SetStateAction<UploadItem[]>>,
  parentId: string,
  userId: string,
  userEmail?: string,
  fileNameOverride?: string,
) => {
  const upload = async () => {
    try {
      const folder = `google-drive-clone/${userId}`;
      const signResponse = await fetch("/api/cloudinary/sign-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folder }),
      });

      if (!signResponse.ok) {
        throw new Error("Failed to prepare Cloudinary upload.");
      }

      const { signature, timestamp, apiKey, cloudName } =
        (await signResponse.json()) as {
          signature: string;
          timestamp: number;
          apiKey: string;
          cloudName: string;
        };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);

        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;

          const progress = Math.round((event.loaded / event.total) * 100);
          setUploads((prev) =>
            prev.map((upload) =>
              upload.id === uploadId ? { ...upload, progress } : upload,
            ),
          );
        };

        xhr.onload = async () => {
          if (xhr.status < 200 || xhr.status >= 300) {
            reject(new Error("Cloudinary upload failed."));
            return;
          }

          const result = JSON.parse(xhr.responseText) as {
            public_id: string;
            resource_type: string;
            secure_url: string;
          };

          try {
            await addFiles(
              result.secure_url,
              fileNameOverride ?? file.name,
              parentId,
              userId,
              userEmail,
              result.public_id,
              result.resource_type,
              Number(file.size ?? 0),
            );

            setUploads((prev) =>
              prev.map((upload) =>
                upload.id === uploadId
                  ? { ...upload, progress: 100, fileLink: result.secure_url }
                  : upload,
              ),
            );
            resolve();
          } catch (metadataError) {
            await fetch("/api/cloudinary/destroy", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                publicId: result.public_id,
                resourceType: result.resource_type,
              }),
            }).catch(console.error);
            reject(metadataError);
          }
        };

        xhr.onerror = () => reject(new Error("Cloudinary upload failed."));
        xhr.send(formData);
      });
    } catch (error) {
      setUploads((prev) => prev.filter((upload) => upload.id !== uploadId));
      throw error;
    }
  };

  return upload();
};

export default fileUpload;
