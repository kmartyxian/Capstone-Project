import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({});

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "OPTIONS,POST,PATCH",
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}

async function sendToApp(path, method, body) {
  const appApiUrl = process.env.APP_API_URL;

  if (!appApiUrl) {
    return response(500, "APP_API_URL is missing in Lambda environment variables.");
  }

  const appResponse = await fetch(`${appApiUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await appResponse.text();
  return response(appResponse.status, text);
}

async function createUploadUrl(body) {
  const bucketName = process.env.UPLOAD_BUCKET_NAME;

  if (!bucketName) {
    return response(500, "UPLOAD_BUCKET_NAME is missing in Lambda environment variables.");
  }

  if (!body.fileName) {
    return response(400, "fileName is required.");
  }

  const safeFileName = body.fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
  const key = `patient-uploads/general/${Date.now()}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: body.contentType || "application/octet-stream",
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return response(200, {
    uploadUrl,
    key,
  });
}

export async function handler(event) {
  try {
    if (event.requestContext?.http?.method === "OPTIONS") {
      return response(200, "");
    }

    const method = event.requestContext?.http?.method || event.httpMethod;
    const path = event.rawPath || event.path;
    const body = event.body ? JSON.parse(event.body) : {};

    console.log("Cloud API request", method, path);

    if (method === "POST" && path.endsWith("/patients")) {
      return sendToApp("/api/user", "POST", body);
    }

    if (method === "PATCH" && path.endsWith("/patients/status")) {
      return sendToApp("/api/user", "PATCH", body);
    }

    if (method === "POST" && path.endsWith("/notes")) {
      return sendToApp("/api/notes", "POST", body);
    }

    if (method === "POST" && path.endsWith("/uploads/url")) {
      return createUploadUrl(body);
    }

    return response(404, "Cloud route not found.");
  } catch (error) {
    console.error(error);
    return response(500, "Cloud API error: " + error.message);
  }
}
