/**
 * Client-Side Image Compression Utility
 * Resizes large camera/phone photos before uploading to storage.
 * Reduces 10MB+ files down to ~200-400KB in milliseconds without visual quality loss.
 */

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: "image/webp" | "image/jpeg";
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1440,
    quality = 0.82,
    mimeType = "image/jpeg",
  } = options;

  // If the file is SVG or small GIF, don't attempt canvas compression
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  // If file is already smaller than 300KB and JPEG/WebP, return as is
  if (file.size < 300 * 1024 && (file.type === "image/jpeg" || file.type === "image/webp")) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Downscale while preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // fallback to original if canvas 2d context fails
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Create compressed file with clean extension
            const originalName = file.name.replace(/\.[^/.]+$/, "");
            const ext = mimeType === "image/webp" ? "webp" : "jpg";
            const compressedFile = new File([blob], `${originalName}.${ext}`, {
              type: mimeType,
              lastModified: Date.now(),
            });

            // If compressed file turned out larger than original for any reason, keep original
            if (compressedFile.size > file.size) {
              resolve(file);
            } else {
              resolve(compressedFile);
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => {
        resolve(file); // fallback on image load error
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}
