# Cloud Computing Project Plan

## Project Name

Cloud-Based Medical Tourism Management Platform

## Project Idea

This project adds a small AWS cloud layer to the existing Medical Tourism Platform. The original capstone project stays the same and continues to use Next.js, React, Prisma, SQLite, and the current patient and note APIs.

The cloud version demonstrates how the same medical tourism workflow can be deployed and connected to AWS services without rebuilding the application.

## Minimum AWS Services Used

This setup uses four AWS services:

1. API Gateway
2. Lambda
3. ECS
4. S3

CloudWatch is also used automatically because Lambda and ECS write logs there.

## Simple Architecture

```text
User Browser
   |
   | opens the existing Next.js app
   v
ECS Container Service
   |
   | runs the current capstone project
   v
Next.js App + Prisma + SQLite

User Browser
   |
   | cloud request from /cloud page
   v
API Gateway
   |
   v
Lambda cloud-api function
   |
   | forwards patient and note data
   v
Existing Next.js API routes on ECS
   |
   v
Prisma + current database setup

Lambda cloud-api function
   |
   | creates upload links
   v
S3 patient upload bucket

Lambda and ECS
   |
   v
CloudWatch logs
```

## What Each AWS Service Does

### API Gateway

API Gateway gives the project public cloud API routes.

Routes:

- `POST /patients`
- `PATCH /patients/status`
- `POST /notes`
- `POST /uploads/url`

The frontend can call API Gateway instead of calling only local Next.js routes.

### Lambda

Lambda runs the simple cloud backend function in `cloud/lambda/cloud-api`.

The Lambda function:

- receives requests from API Gateway
- forwards patient requests to the current `/api/user` route
- forwards note requests to the current `/api/notes` route
- creates S3 upload links for patient files
- writes simple logs with `console.log`

This keeps the existing Prisma and database logic in the original app.

### ECS

ECS runs the current Next.js app in a container.

The project now includes:

- `Dockerfile`
- `.dockerignore`

ECS is used for deployment only. It does not change the application code or database models.

### S3

S3 stores optional patient upload files, such as travel documents or medical forms.

The simple Lambda upload route creates a temporary upload URL. This avoids putting AWS credentials in the frontend.

### CloudWatch

CloudWatch stores logs from Lambda and ECS.

For the class demo, CloudWatch can be shown as proof that cloud requests are reaching Lambda and the deployed container.

## Why DynamoDB Is Not Needed

The assignment says to use at least four services from the list/options. This project already uses API Gateway, Lambda, ECS, and S3.

DynamoDB is not required for the minimum version. The current Prisma and SQLite database are kept because they are already part of the capstone project.

Optional DynamoDB feature if the instructor requires it:

- create one small `ActivityLog` table
- store only simple cloud events, like `patient-created` or `file-upload-url-created`
- do not store patient medical data in DynamoDB

## Minimum Features Needed

Only these features are needed for the cloud project:

1. Deploy the existing Next.js app to ECS.
2. Create API Gateway routes.
3. Create one Lambda function that forwards patient and note requests.
4. Create one S3 bucket for patient upload files.
5. Show CloudWatch logs during the demo.
6. Use the `/cloud` page to send one patient request through API Gateway.

## Optional Features

These can be skipped unless there is extra time:

- DynamoDB activity log
- real file upload UI
- custom domain name
- advanced authentication
- production database migration
- CI/CD pipeline
- private VPC networking
- load balancer health checks beyond the basic ECS setup

## What To Prioritize First

1. Keep the current app running locally.
2. Build the Docker container.
3. Deploy the container to ECS.
4. Create the Lambda function.
5. Put API Gateway in front of Lambda.
6. Add the S3 bucket and upload URL route.
7. Test the `/cloud` page.
8. Screenshot ECS, API Gateway, Lambda, S3, and CloudWatch for the final report.

## Beginner-Friendly Setup Roadmap

### Step 1: Test The Existing Project Locally

```bash
npm install
npx prisma db push
npm run dev
```

Open:

```text
http://localhost:3000
```

### Step 2: Build The Docker Image

```bash
docker build -t medical-tourism-platform .
docker run -p 3000:3000 --env-file .env medical-tourism-platform
```

Open:

```text
http://localhost:3000
```

### Step 3: Push The Image To ECR

In AWS:

1. Create an ECR repository.
2. Use the push commands shown by ECR.
3. Confirm the image appears in ECR.

### Step 4: Deploy The App To ECS

Use the easiest ECS option:

1. Create an ECS cluster.
2. Use Fargate.
3. Create a task definition using the ECR image.
4. Add the `DATABASE_URL` environment variable.
5. Expose port `3000`.
6. Start one running service.

For the simplest class demo, one task is enough.

### Step 5: Create The S3 Bucket

Create one bucket for uploads:

```text
medical-tourism-patient-uploads
```

Keep the bucket private.

### Step 6: Create The Lambda Function

Use the code in:

```text
cloud/lambda/cloud-api
```

Set these Lambda environment variables:

```env
APP_API_URL=https://your-ecs-app-url.com
UPLOAD_BUCKET_NAME=medical-tourism-patient-uploads
```

Give Lambda permission to put files in the S3 bucket.

### Step 7: Create API Gateway

Create an HTTP API and connect it to the Lambda function.

Routes:

```text
POST /patients
PATCH /patients/status
POST /notes
POST /uploads/url
```

Enable CORS for the frontend.

### Step 8: Connect The Frontend To API Gateway

Set this environment variable when running or deploying the app:

```env
NEXT_PUBLIC_CLOUD_API_URL=https://your-api-gateway-url.com
```

Then open:

```text
/cloud
```

Submit a patient request and confirm the patient appears in the provider dashboard.

## Presentation Demo

### Demo 1: Existing Capstone Still Works

Show:

- provider login
- patient dashboard
- add patient
- edit patient
- patient notes

### Demo 2: ECS Deployment

Show:

- Dockerfile in the project
- ECS service running
- deployed app URL

### Demo 3: API Gateway And Lambda

Show:

- API Gateway routes
- Lambda function code
- `/cloud` page sending a patient request
- patient appearing in the existing dashboard

### Demo 4: S3 Upload Support

Show:

- private S3 bucket
- Lambda route that creates an upload URL
- optional test request to `POST /uploads/url`

### Demo 5: CloudWatch Logs

Show:

- Lambda log line for the cloud request
- ECS logs for the running app

## Initial Presentation Outline

Use these slides:

1. Project title: Cloud-Based Medical Tourism Management Platform
2. Existing capstone overview
3. Cloud problem being solved
4. AWS services selected
5. Architecture diagram
6. Minimum features planned
7. What will stay the same
8. What will be added
9. Expected demo

Main message:

The goal is to add cloud deployment and cloud APIs to an existing working medical tourism app without replacing the current database or rewriting the project.

## Final Presentation Outline

Use these slides:

1. Project title
2. Original capstone features
3. Final cloud architecture
4. ECS deployment demo
5. API Gateway and Lambda demo
6. S3 upload support
7. CloudWatch logs
8. Problems solved
9. What I learned
10. Future improvements

## Final Report Sections

Include these sections:

1. Introduction
2. Existing capstone project background
3. Cloud computing goals
4. AWS services used
5. Architecture diagram
6. Implementation steps
7. Testing and demo results
8. Screenshots
9. Challenges
10. Future improvements
11. Conclusion

## Resume Bullet Points

- Added an AWS cloud layer to a full-stack medical tourism platform using API Gateway, Lambda, ECS, S3, and CloudWatch.
- Containerized a Next.js, React, Prisma, and SQLite application for deployment on Amazon ECS.
- Built a simple serverless API with AWS Lambda that forwards cloud requests to existing application APIs without replacing the current database design.
- Created an S3 upload workflow for patient documents using temporary upload URLs.
- Documented cloud architecture, deployment steps, demo workflow, and service responsibilities for a portfolio-ready project.

## Portfolio Description

This project extends my medical tourism capstone application with a simple AWS cloud architecture. The original app manages patients, providers, profile information, and notes using Next.js, React, Prisma, and SQLite. The cloud version adds ECS deployment, API Gateway routes, a Lambda backend layer, S3 upload support, and CloudWatch logs. The design keeps the original database and application logic while showing how a working full-stack app can be deployed and connected to cloud services.

## Why This Demonstrates Cloud Computing Knowledge

This project is simple, but it still demonstrates important cloud computing ideas:

- container deployment with ECS
- serverless functions with Lambda
- managed HTTP routing with API Gateway
- object storage with S3
- log monitoring with CloudWatch
- environment variables for cloud configuration
- separation between frontend, cloud API layer, and application backend
- keeping an existing database integration while adding cloud services around it

## Fastest Realistic Completion Plan

Day 1:

- keep the current app working
- add Dockerfile
- build the app locally in Docker

Day 2:

- push image to ECR
- deploy one ECS task
- confirm the deployed app opens

Day 3:

- create Lambda
- create API Gateway routes
- connect `/cloud` page to API Gateway

Day 4:

- create S3 bucket
- test upload URL route
- check CloudWatch logs

Day 5:

- record demo
- finish screenshots
- complete final report

## Recommended Final Scope

The best final scope is:

- ECS deployed app
- API Gateway route for cloud patient creation
- Lambda forwarding to the existing app API
- S3 upload URL route
- CloudWatch logs shown in the demo

Do not add DynamoDB unless the instructor specifically requires it.
