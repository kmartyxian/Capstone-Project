# Cloud API Lambda

This Lambda function is the small cloud layer for the capstone project.

It does not replace the current Next.js, Prisma, or SQLite code. It forwards patient and note requests to the existing app API after the app is deployed on ECS.

## Environment Variables

```env
APP_API_URL=https://your-ecs-app-url.com
UPLOAD_BUCKET_NAME=your-s3-bucket-name
```

## API Gateway Routes

- `POST /patients` forwards to the current Next.js route `POST /api/user`.
- `PATCH /patients/status` forwards to the current Next.js route `PATCH /api/user`.
- `POST /notes` forwards to the current Next.js route `POST /api/notes`.
- `POST /uploads/url` creates a short S3 upload URL for a patient file.

## Why This Is Simple

The Lambda function only acts as a cloud entry point. The real patient data still uses the existing Prisma database setup from the capstone project.
