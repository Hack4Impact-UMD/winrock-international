import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

// Initialize S3 client
// AWS credentials should be set via environment variables:
// AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
// S3_BUCKET_NAME should also be set
const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

/**
 * Generates a presigned URL for uploading a file to S3
 * @param projectId - The project ID
 * @param fileName - The name of the file
 * @returns Presigned URL and S3 key
 */
export async function getS3UploadUrl(
    projectId: string,
    fileName: string
): Promise<{ uploadUrl: string; s3Key: string }> {
    if (!BUCKET_NAME) {
        throw new Error("S3_BUCKET_NAME environment variable is not set");
    }

    // Generate a unique key for the file
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const s3Key = `projectFiles/${projectId}/${timestamp}_${sanitizedFileName}`;

    // Create PutObject command
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        ContentType: "application/octet-stream",
    });

    // Generate presigned URL (valid for 1 hour)
    const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
    });

    return { uploadUrl, s3Key };
}

/**
 * Gets the public URL for an S3 object
 * @param s3Key - The S3 key of the object
 * @returns Public URL
 */
export function getS3PublicUrl(s3Key: string): string {
    if (!BUCKET_NAME) {
        throw new Error("S3_BUCKET_NAME environment variable is not set");
    }
    const region = process.env.AWS_REGION || "us-east-1";
    // For us-east-1, the URL format is different
    if (region === "us-east-1") {
        return `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
    } else {
        return `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${s3Key}`;
    }
}

