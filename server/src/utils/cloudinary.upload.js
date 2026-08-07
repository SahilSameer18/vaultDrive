import cloudinary from "../config/cloudinary.js";
import ApiError from "./ApiError.js";

// Sanitize filename to remove special characters and path traversal sequences
export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9.\-]/g, "-");
};

// Stream buffer to Cloudinary with scoped path: vaultDrive/<userId>/<fileId>-<sanitizedFilename>
export const uploadToCloudinary = (buffer, mimetype, userId, fileId, originalFilename) => {
  return new Promise((resolve, reject) => {
    const sanitized = sanitizeFilename(originalFilename);
    
    // Check if asset is image, video, audio, or PDF vs raw document/archive (Cloudinary treats PDF as image type)
    const isMedia =
      mimetype.startsWith("image/") ||
      mimetype.startsWith("video/") ||
      mimetype.startsWith("audio/") ||
      mimetype === "application/pdf";

    // Raw files (PDFs, ZIPs, DOCX, TXT) MUST keep extension in public_id so Cloudinary delivery works
    const filenameWithoutExt = sanitized.replace(/\.[^/.]+$/, "");
    const publicId = isMedia ? `${fileId}-${filenameWithoutExt}` : `${fileId}-${sanitized}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `vaultDrive/${userId}`,
        public_id: publicId,
        resource_type: "auto", // auto detects image, video, or raw
      },
      (error, result) => {
        if (error) {
          return reject(new ApiError(500, `Cloudinary upload failed: ${error.message}`));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type, // "image" | "video" | "raw"
        });
      }
    );

    uploadStream.end(buffer);
  });
};

// Delete file from Cloudinary using exact publicId and stored resourceType
export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    
    // Fallback attempt without explicit resource_type if result is not "ok"
    if (result.result !== "ok") {
      await cloudinary.uploader.destroy(publicId);
    }
    return result;
  } catch (error) {
    throw new ApiError(500, `Failed to delete file from Cloudinary: ${error.message}`);
  }
};

