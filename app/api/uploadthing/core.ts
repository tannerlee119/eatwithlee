import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const imageUploadConfig = {
  "image/jpeg": { maxFileSize: "4MB", maxFileCount: 10 },
  "image/png": { maxFileSize: "4MB", maxFileCount: 10 },
} as const;

export const ourFileRouter = {
  imageUploader: f(imageUploadConfig)
    .middleware(async () => {
      // This code runs on your server before upload
      console.log("Middleware: Upload starting...");

      // Return metadata for upload
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete!");
      console.log("File URL:", file.url);
      console.log("Uploaded by:", metadata.uploadedBy);

      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
