"use client";
import { useCallback } from "react";

export default function useCloudinaryUpload() {
  const openWidget = useCallback(() => {
    return new Promise((resolve, reject) => {
      // Check if Cloudinary script is loaded
      if (!window.cloudinary) {
        reject(new Error("Cloudinary script not loaded"));
        return;
      }
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url"],
          multiple: false,
          maxFiles: 1,
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            resolve(result.info.secure_url);
          } else if (error) {
            reject(error);
          }
          // Widget handles its own closing
        }
      );
      widget.open();
    });
  }, []);

  return { upload: openWidget };
}