/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary with explicit values to debug
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dykcbj10r",
  api_key: process.env.CLOUDINARY_API_KEY || "651318966628939",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "3xPBt1jm83iRlD0TgiESmF5321c",
});

export async function POST(request: NextRequest) {
  try {
    // Log config to debug (remove in production)
    console.log("Cloudinary Config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Not set",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Not set",
    });

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with a more direct approach
    const cloudinaryResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "event-images",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );

      // Convert buffer to stream and pipe to uploadStream
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });

    // Return Cloudinary URL and other relevant data
    return NextResponse.json({
      url: (cloudinaryResponse as any).secure_url,
      public_id: (cloudinaryResponse as any).public_id,
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
