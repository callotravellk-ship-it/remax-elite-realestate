import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token:
        process.env.BLOB_READ_WRITE_TOKEN ||
        "vercel_blob_rw_mNZvxUN6N1dAguAz_L70HLcyRorOT9U5KiL7AWONr9CUPkx",
      onBeforeGenerateToken: async (
        pathname: string,
        /* clientPayload?: string | null */
      ) => {
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "image/avif",
            "image/svg+xml",
          ],
          maximumSizeInBytes: 30 * 1024 * 1024, // 30MB limit per image
          tokenPayload: JSON.stringify({
            uploadedAt: new Date().toISOString(),
            pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Runs on server after client uploads directly to Vercel Blob
        console.log("Vercel Blob upload completed:", blob.url, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Vercel Blob handleUpload error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
