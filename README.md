# Medical Tourism Platform

**Name:** Jeremy Wanguhu  
**Course:** CIDS 484  
**Semester:** Spring 2026  
**Repository:** https://github.com/kmartyxian/Capstone-Project  
**Branch:** `CloudImplementation`

## Project Description

The Medical Tourism Platform is a full-stack web application for managing the patient side and provider side of a medical tourism workflow. It stores patient intake information, medical history, emergency contacts, insurance details, appointment preferences, travel details, notes, and patient status.

The final version combines the work from the milestone branches into one main branch. The app includes patient intake, a provider-facing patient management dashboard, patient and provider login flows, patient profile editing, and notes connected to patient records.

## Cloud Implementation Branch

This branch adds a simple cloud computing version of the Medical Tourism Platform for the Cloud Computing Project. The goal of this branch is not to rebuild the capstone project. The goal is to keep the original capstone project working the same way and add a small AWS cloud layer around it.

The cloud version uses the existing capstone project as the base. The same Next.js app, React pages, Prisma setup, SQLite database, patient API routes, notes API routes, and dashboard flow are still used. The added cloud files show how the project can be deployed to AWS and how cloud services can send requests into the existing app.

### Main Cloud Project Goal

The main goal is to turn the existing medical tourism capstone project into a simple cloud-based medical tourism management platform.

The cloud version demonstrates:

- Running the existing Next.js application in a container.
- Deploying the application with Amazon ECS.
- Creating cloud API routes with API Gateway.
- Running simple backend cloud logic with AWS Lambda.
- Using S3 for patient file upload support.
- Using CloudWatch logs to monitor cloud requests.
- Keeping the current Prisma and SQLite database integration instead of replacing it.

This branch is designed to satisfy the cloud project requirement while keeping the code simple enough to explain in a class presentation.

### Important Cloud Rule

The database was not replaced.

The original database setup is still:

```env
DATABASE_URL="file:./dev.db"
```

The database schema is still in:

```text
prisma/schema.prisma
```

The Prisma client setup is still in:

```text
lib/prisma.ts
```

The SQLite database file is expected locally at:

```text
prisma/dev.db
```

That database file is ignored by Git, so it is not pushed to GitHub. This is normal for SQLite development databases.

The cloud layer connects to the existing app APIs. Those existing app APIs continue to use Prisma. This means the cloud features are added around the current database setup instead of replacing it with DynamoDB or another database.

### AWS Services Used

This cloud project uses these AWS services:

1. API Gateway
2. Lambda
3. ECS
4. S3
5. CloudWatch

Only the first four are needed to satisfy the main cloud service requirement. CloudWatch is also included because Lambda and ECS automatically create logs there, and those logs are useful for the final demo.

### Why DynamoDB Was Not Added

DynamoDB was not added because the project already has a working database integration with Prisma and SQLite.

Adding DynamoDB as the main database would require redesigning the project and replacing the current database logic. That would go against the goal of this branch, which is to add cloud computing features without rebuilding the capstone project.

If DynamoDB is required by the instructor later, it should only be used for a tiny separate feature, such as a simple activity log. It should not store the main patient records, notes, provider records, or profile data.

Example optional DynamoDB use:

```text
ActivityLog table
- id
- action
- message
- createdAt
```

That would allow the project to mention DynamoDB without replacing the real app database.

## What Was Added In This Branch

### 1. Dockerfile

Added file:

```text
Dockerfile
```

The Dockerfile is used to package the existing Next.js app into a container so it can run on ECS.

The Dockerfile does these steps:

1. Starts from the Node 20 Alpine image.
2. Sets the working folder to `/app`.
3. Copies `package.json` and `package-lock.json`.
4. Installs dependencies with `npm install`.
5. Copies the rest of the project files.
6. Runs `npx prisma generate`.
7. Builds the Next.js app with `npm run build`.
8. Exposes port `3000`.
9. Starts the app with `npm start`.

This does not change the app code. It only adds a way to run the same app inside a container.

### 2. .dockerignore

Added file:

```text
.dockerignore
```

This file tells Docker which files should not be copied into the container image.

It ignores:

- `node_modules`
- `.next`
- `.git`
- local database files
- `.env`
- README files

This keeps the Docker image cleaner and avoids copying local development files into the image.

### 3. Cloud Test Page

Added file:

```text
app/cloud/page.tsx
```

This adds a new page at:

```text
http://localhost:3000/cloud
```

The cloud page is a simple form that lets a user submit a patient request through the cloud API.

The page asks for:

- first name
- last name
- email
- status

When the user clicks `Send Cloud Request`, the page sends a request to the API Gateway URL stored in:

```env
NEXT_PUBLIC_CLOUD_API_URL
```

The frontend request goes to:

```text
POST {NEXT_PUBLIC_CLOUD_API_URL}/patients
```

This page does not save directly to Prisma. It sends the request to AWS API Gateway first. API Gateway sends the request to Lambda. Lambda forwards it to the existing app API.

If `NEXT_PUBLIC_CLOUD_API_URL` is not set, the page shows this message:

```text
Add NEXT_PUBLIC_CLOUD_API_URL to use the AWS API Gateway endpoint.
```

This makes the page safe to open locally even before AWS is fully set up.

The same cloud page now also has a simple S3 file upload section.

The upload section asks for:

- patient id
- file

When the user clicks `Upload File`, the page sends the file information to:

```text
POST {NEXT_PUBLIC_CLOUD_API_URL}/uploads/url
```

The request body includes:

```json
{
  "fileName": "example.pdf",
  "patientId": "patient-id-here",
  "contentType": "application/pdf"
}
```

Lambda returns:

```json
{
  "uploadUrl": "temporary-s3-upload-url",
  "key": "patient-uploads/patient-id-here/file-name"
}
```

Then the browser uploads the actual file directly to S3 using the `uploadUrl`.

After the upload finishes, the page shows:

- a success message
- the S3 key

The S3 key is important because it shows where the file was stored in the S3 bucket.

The cloud page can be opened in two simple ways:

1. From the main login page using the blue `Cloud Request` button.
2. From the provider patient dashboard using the `Cloud Request` button next to `+ Add Patient`.

This makes the cloud feature easy to find during a class demo. A user does not need to manually type `/cloud` in the browser if they do not want to.

### 4. Cloud Request Button On Login Page

Changed file:

```text
app/page.tsx
```

The main login page now includes a blue `Cloud Request` button near the bottom of the page.

This button links to:

```text
/cloud
```

This was added so the cloud feature is visible immediately when the app opens. Before this change, the cloud page existed, but a user had to know the `/cloud` URL or open it manually.

The login page still keeps the original provider login, patient login, provider register, and patient register sections. The new cloud button only adds navigation to the cloud request page.

### 5. Cloud Request Button On Provider Dashboard

Changed file:

```text
app/patients/page.tsx
```

The provider patient dashboard now includes a `Cloud Request` button beside the existing `+ Add Patient` button.

This button links to:

```text
/cloud
```

The dashboard button is useful because providers are the main users managing patient requests. During a demo, the flow can be:

1. Log in as a provider.
2. Open the patient dashboard.
3. Click `Cloud Request`.
4. Submit a patient request through the cloud page.
5. Return to the patient dashboard and show the patient record.

The original `+ Add Patient` button still works the same way. The cloud button does not replace local patient creation. It adds a second cloud-based way to start a patient request.

### 6. S3 Upload Section On Cloud Page

Changed file:

```text
app/cloud/page.tsx
```

The cloud page now includes a real S3 upload feature.

This was added to the existing cloud page instead of creating a new page because it keeps the cloud demo simple. The patient request form and the S3 upload form are both in one place.

The upload code is intentionally simple:

1. The user enters a patient id.
2. The user chooses a file from the browser.
3. The frontend sends `fileName`, `patientId`, and `contentType` to API Gateway.
4. API Gateway sends the request to Lambda.
5. Lambda creates a pre-signed S3 upload URL.
6. Lambda returns the `uploadUrl` and S3 `key`.
7. The frontend uploads the real file directly to S3.
8. The page shows a success message and the S3 key.

No database changes were made for this feature.

The uploaded file is not saved in Prisma. The purpose of this feature is to demonstrate S3 object storage and direct browser upload using a pre-signed URL.

### 7. Lambda Cloud API

Added folder:

```text
cloud/lambda/cloud-api
```

Important files:

```text
cloud/lambda/cloud-api/index.mjs
cloud/lambda/cloud-api/package.json
cloud/lambda/cloud-api/README.md
```

The Lambda function is the small cloud backend for this project.

It receives requests from API Gateway and then forwards them to the existing Next.js API routes. This keeps the original app logic in one place.

The Lambda function supports these cloud routes:

```text
POST /patients
PATCH /patients/status
POST /notes
POST /uploads/url
```

The existing `POST /uploads/url` route is used by the new upload section on the `/cloud` page.

No Lambda change was needed for the S3 upload screen because the Lambda file already had the upload URL route.

### 8. Cloud Project Documentation

Added file:

```text
docs/cloud-computing-project.md
```

This file contains the longer cloud project plan.

It includes:

- project idea
- AWS services used
- architecture diagram description
- step-by-step setup roadmap
- presentation demo plan
- initial presentation outline
- final presentation outline
- final report outline
- resume bullet points
- portfolio description
- optional features
- what to prioritize first

This file is meant to help explain the project for class and portfolio use.

## One Existing File That Was Changed

Changed file:

```text
app/api/register/route.ts
```

This file had references to a `username` field when checking and creating providers and patients.

The current Prisma schema does not include a `username` field on `Provider` or `Patient`.

The schema currently has:

```text
Provider
- id
- name
- email
- location
- createdAt

Patient
- id
- firstName
- lastName
- email
- many patient intake fields
- notesList
```

Because `username` does not exist in the Prisma schema, the production build failed. This matters for ECS because ECS needs the app to build successfully before it can run in a container.

The change was small:

- provider registration now checks `Provider.name`
- patient registration now checks `Patient.email`
- the route no longer tries to save `username` into the database

This was not a database redesign. It was a small compatibility fix so the existing code matches the existing Prisma schema.

## How The Cloud Version Works With The Existing Capstone Project

The original capstone app already has working patient management features.

Important existing app routes:

```text
app/api/user/route.ts
app/api/notes/route.ts
app/api/auth/provider/route.ts
app/api/auth/patient/route.ts
```

The cloud branch does not replace these routes. It uses them.

### Existing Patient Flow

The original app can already create a patient through:

```text
POST /api/user
```

That route uses Prisma:

```text
lib/prisma.ts
```

Prisma writes the patient into the SQLite database:

```text
prisma/dev.db
```

The provider dashboard reads patients from:

```text
GET /api/user
```

This means the normal capstone flow is:

```text
Provider Dashboard
   |
   v
/api/user
   |
   v
Prisma
   |
   v
SQLite database
```

### New Cloud Patient Flow

The cloud branch adds a second way to create a patient request.

The new cloud flow is:

```text
Cloud Request button
   |
   v
/cloud page
   |
   v
API Gateway POST /patients
   |
   v
Lambda cloud-api function
   |
   v
Existing Next.js POST /api/user route
   |
   v
Prisma
   |
   v
SQLite database
```

This proves the app can receive cloud-based API requests while still using the same existing backend and database.

### Existing Notes Flow

The original app can already create a note through:

```text
POST /api/notes
```

The note is connected to a patient by `patientId`.

The existing notes flow is:

```text
Patient profile page
   |
   v
/api/notes
   |
   v
Prisma Note model
   |
   v
SQLite database
```

### New Cloud Notes Flow

The Lambda function also supports:

```text
POST /notes
```

The cloud notes flow is:

```text
API Gateway POST /notes
   |
   v
Lambda cloud-api function
   |
   v
Existing Next.js POST /api/notes route
   |
   v
Prisma
   |
   v
SQLite database
```

This means notes still use the existing `Note` model and existing database relationship.

## Full Cloud Architecture

Simple text version:

```text
User Browser
   |
   | opens deployed app
   v
Amazon ECS
   |
   | runs Docker container
   v
Next.js Medical Tourism Platform
   |
   | uses existing API routes
   v
Prisma
   |
   v
SQLite database
```

Cloud API version:

```text
User Browser
   |
   | submits from /cloud page
   v
API Gateway
   |
   | sends request to Lambda
   v
Lambda cloud-api
   |
   | forwards request to deployed Next.js app
   v
Existing Next.js API routes
   |
   | use Prisma
   v
SQLite database
```

Upload version:

```text
User Browser
   |
   | chooses file and asks for upload URL
   v
API Gateway POST /uploads/url
   |
   v
Lambda cloud-api
   |
   | creates temporary upload link
   v
S3 private upload bucket
```

Full S3 upload flow:

```text
Browser chooses file
   |
   v
Frontend sends file info to API Gateway /uploads/url
   |
   v
API Gateway triggers Lambda
   |
   v
Lambda creates pre-signed S3 upload URL
   |
   v
Frontend uploads file directly to S3
   |
   v
S3 stores the file
   |
   v
Page shows success message and S3 key
```

Logging version:

```text
Lambda
   |
   v
CloudWatch Logs

ECS container
   |
   v
CloudWatch Logs
```

## Explanation Of Each AWS Service

### API Gateway

API Gateway is the public cloud API entrance.

Instead of only calling the app's local API routes directly, the cloud page can call an AWS URL.

Example:

```text
https://your-api-gateway-url.com/patients
```

API Gateway receives the HTTP request and sends it to Lambda.

For this project, API Gateway demonstrates:

- cloud-hosted API endpoints
- request routing
- CORS support for browser requests
- separating the frontend from the cloud backend entry point

### Lambda

Lambda runs backend code without managing a server.

In this project, Lambda is intentionally simple.

It does not replace the Next.js app. It works like a cloud middle layer.

Lambda does these jobs:

- receives patient requests from API Gateway
- receives note requests from API Gateway
- forwards those requests to the existing Next.js API routes
- creates S3 upload URLs
- logs requests for CloudWatch

The Lambda function uses this environment variable:

```env
APP_API_URL=https://your-ecs-app-url.com
```

That value tells Lambda where the deployed Next.js app is running.

For example, when Lambda receives:

```text
POST /patients
```

It forwards the data to:

```text
{APP_API_URL}/api/user
```

### ECS

ECS runs the existing capstone project as a container.

The app already runs locally with:

```bash
npm run dev
```

For AWS deployment, the app needs to run in a container. The Dockerfile creates that container.

ECS uses the Docker image to run the app in AWS.

For this project, ECS demonstrates:

- container deployment
- running a web application in the cloud
- exposing the Next.js app on port `3000`
- using environment variables in a cloud container

### S3

S3 is used for patient file upload support.

The project does not need a complicated file system. S3 is a simple AWS service for storing files.

Possible patient files:

- passport scan
- medical form
- insurance document
- travel document
- appointment document

The Lambda route:

```text
POST /uploads/url
```

creates a temporary upload URL. The `/cloud` page uses that URL to upload a file directly to S3.

This is better than putting AWS access keys inside the frontend.

The S3 upload feature does not use Prisma and does not change the patient database. It only stores the selected file in S3.

### CloudWatch

CloudWatch stores logs from AWS services.

The Lambda function includes:

```text
console.log("Cloud API request", method, path);
```

Those logs appear in CloudWatch.

ECS can also send app logs to CloudWatch.

For the final demo, CloudWatch is useful because it proves the cloud services are actually receiving requests.

## Environment Variables

### Local App Environment

The normal local database variable is:

```env
DATABASE_URL="file:./dev.db"
```

This tells Prisma to use the SQLite database file.

### Frontend Cloud Environment

The cloud page uses:

```env
NEXT_PUBLIC_CLOUD_API_URL=https://your-api-gateway-url.com
```

This tells the browser where the API Gateway endpoint is.

If this is missing, the `/cloud` page still opens, but it will not send the cloud request.

### Lambda Environment

The Lambda function uses:

```env
APP_API_URL=https://your-ecs-app-url.com
UPLOAD_BUCKET_NAME=your-s3-bucket-name
```

`APP_API_URL` points to the deployed Next.js app.

`UPLOAD_BUCKET_NAME` points to the private S3 bucket used for uploads.

## How To Run Locally

Use the same steps as the original capstone project.

```bash
npm install
npx prisma db push
npm run dev
```

On Windows PowerShell, use:

```bash
npm.cmd install
npx.cmd prisma db push
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

Open the cloud test page:

```text
http://localhost:3000/cloud
```

You can also open the same cloud page by clicking `Cloud Request` on the login page or on the provider patient dashboard.

The cloud page will need `NEXT_PUBLIC_CLOUD_API_URL` before it can send requests to AWS.

The S3 upload section also uses the same environment variable:

```env
NEXT_PUBLIC_CLOUD_API_URL=https://your-api-gateway-url.com
```

## How To Test The Existing Database Flow

Create a patient through the original API:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/user `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"firstName":"Cloud","lastName":"Test","email":"cloudtest@example.com","status":"Active"}'
```

Then open:

```text
http://localhost:3000/patients
```

The patient should appear in the dashboard if provider login is set up.

This proves the original API still works.

## How To Test The Cloud Page Locally

Before AWS is connected, open:

```text
http://localhost:3000/cloud
```

Or click:

```text
Cloud Request
```

Try to submit the form.

If no API Gateway URL is configured, the page will show:

```text
Add NEXT_PUBLIC_CLOUD_API_URL to use the AWS API Gateway endpoint.
```

After API Gateway is created, add this to the environment:

```env
NEXT_PUBLIC_CLOUD_API_URL=https://your-api-gateway-url.com
```

Then restart the app and submit the form again.

The request should travel through:

```text
/cloud page -> API Gateway -> Lambda -> /api/user -> Prisma -> SQLite
```

## How To Test The S3 Upload Feature

The S3 upload feature is on the same cloud page:

```text
http://localhost:3000/cloud
```

Before testing, make sure this frontend environment variable is set:

```env
NEXT_PUBLIC_CLOUD_API_URL=https://your-api-gateway-url.com
```

Also make sure the Lambda function has:

```env
UPLOAD_BUCKET_NAME=your-s3-bucket-name
```

API Gateway needs this route:

```text
POST /uploads/url
```

The S3 bucket also needs CORS rules that allow the browser to upload with `PUT`.

Simple test steps:

1. Open `/cloud`.
2. Go to the `S3 File Upload` section.
3. Enter a patient id.
4. Choose a file from your computer.
5. Click `Upload File`.
6. The page asks API Gateway and Lambda for an upload URL.
7. The browser uploads the file directly to S3.
8. The page shows `File uploaded to S3.`
9. The page shows the S3 key.
10. Open the S3 bucket in AWS and confirm the file exists.

The upload flow is:

```text
Browser chooses file
Frontend sends file info to API Gateway /uploads/url
API Gateway triggers Lambda
Lambda creates pre-signed S3 upload URL
Frontend uploads file directly to S3
S3 stores the file
Page shows success message and S3 key
```

## How To Deploy The Cloud Version

### Step 1: Build The Docker Image

```bash
docker build -t medical-tourism-platform .
```

### Step 2: Run The Docker Image Locally

```bash
docker run -p 3000:3000 --env-file .env medical-tourism-platform
```

Open:

```text
http://localhost:3000
```

### Step 3: Push The Image To Amazon ECR

In AWS:

1. Create an ECR repository.
2. Follow the push commands shown by ECR.
3. Confirm the image appears in ECR.

### Step 4: Deploy To ECS

Use the simplest ECS setup:

1. Create an ECS cluster.
2. Use Fargate.
3. Create a task definition.
4. Use the ECR image.
5. Set container port `3000`.
6. Add `DATABASE_URL` as an environment variable.
7. Start one ECS service.

For a class demo, one running task is enough.

### Step 5: Create The S3 Bucket

Create a private S3 bucket for patient uploads.

Example name:

```text
medical-tourism-patient-uploads
```

### Step 6: Create The Lambda Function

Use the code from:

```text
cloud/lambda/cloud-api
```

Set Lambda environment variables:

```env
APP_API_URL=https://your-ecs-app-url.com
UPLOAD_BUCKET_NAME=medical-tourism-patient-uploads
```

Give Lambda permission to put objects in the S3 bucket.

### Step 7: Create API Gateway

Create an HTTP API Gateway.

Connect it to the Lambda function.

Add routes:

```text
POST /patients
PATCH /patients/status
POST /notes
POST /uploads/url
```

Enable CORS so the browser can call it.

### Step 8: Connect The App To API Gateway

Set this environment variable in the app:

```env
NEXT_PUBLIC_CLOUD_API_URL=https://your-api-gateway-url.com
```

Restart the app.

Open:

```text
/cloud
```

You can get there by clicking the `Cloud Request` button on the login page or the provider dashboard.

Submit a patient request.

## What To Demo In Class

### Demo Part 1: Existing Capstone App

Show that the original project still works:

- login page
- provider login
- patient dashboard
- add patient
- edit patient
- notes
- Prisma database still being used

### Demo Part 2: ECS

Show:

- Dockerfile
- ECR image
- ECS service running
- deployed app URL

Explain:

```text
ECS runs the same capstone project in a cloud container.
```

### Demo Part 3: API Gateway

Show:

- API Gateway routes
- `POST /patients`
- `POST /notes`
- `POST /uploads/url`

Explain:

```text
API Gateway gives the project public cloud API endpoints.
```

### Demo Part 4: Lambda

Show:

- Lambda code in `cloud/lambda/cloud-api/index.mjs`
- Lambda environment variables
- Lambda test event

Explain:

```text
Lambda receives cloud API requests and forwards them to the existing Next.js API routes.
```

### Demo Part 5: Cloud Page

Open:

```text
/cloud
```

The easiest way to open it during the demo is to click the blue `Cloud Request` button on the main login page. If you are already logged in as a provider, you can also click `Cloud Request` on the patient dashboard beside `+ Add Patient`.

Submit a new patient.

Then open:

```text
/patients
```

Show that the patient appears in the existing dashboard.

Explain:

```text
The patient was sent through AWS first, but it still ended up in the same Prisma database.
```

### Demo Part 6: S3

Show:

- S3 bucket
- upload route in Lambda
- S3 File Upload section on `/cloud`
- file upload success message
- S3 key shown on the page
- uploaded file inside the S3 bucket

Explain:

```text
S3 is used for patient document upload support. The browser asks Lambda for a pre-signed upload URL, then uploads the file directly to S3.
```

### Demo Part 7: CloudWatch

Show:

- Lambda logs
- ECS logs

Explain:

```text
CloudWatch shows that the cloud services received and processed the requests.
```

## What This Project Proves

This project proves that the original capstone project can be extended with cloud computing features without being rebuilt.

It demonstrates:

- how to containerize a Next.js app
- how to deploy a web app to ECS
- how to create cloud API routes with API Gateway
- how to run backend logic in Lambda
- how to connect Lambda to an existing application backend
- how to use S3 for file storage
- how to use CloudWatch for logs
- how to keep an existing Prisma database integration

The project is intentionally simple. That makes it easier to explain and easier to demo. It still shows real cloud computing concepts because it uses managed AWS services and connects them to a working full-stack application.

## Minimum Completed Cloud Features

The minimum cloud features added are:

- Docker container setup for ECS.
- New `/cloud` page.
- New `Cloud Request` button on the main login page.
- New `Cloud Request` button on the provider patient dashboard.
- Real S3 upload section on the `/cloud` page.
- Lambda function for cloud API requests.
- API Gateway route plan.
- S3 pre-signed upload URL support.
- Direct browser upload to S3.
- CloudWatch logging through Lambda and ECS.
- Cloud project documentation.

## Optional Future Cloud Improvements

These are not required for the minimum version:

- DynamoDB activity logging.
- Custom domain name.
- HTTPS domain setup.
- Production authentication.
- RDS or managed production database.
- CI/CD deployment pipeline.
- More detailed monitoring dashboards.

## Simple Explanation For Presentation

A simple way to explain this project:

```text
My original capstone project was a medical tourism platform using Next.js, React, Prisma, and SQLite.

For the cloud project, I did not rebuild it. I added AWS cloud services around it.

ECS runs the existing app in a container.
API Gateway gives the app cloud API endpoints.
Lambda handles simple cloud backend requests.
S3 stores patient upload files.
CloudWatch shows logs from the cloud services.

The patient data still goes through my original Next.js API routes and Prisma database setup.
This shows cloud deployment and cloud integration while keeping my original capstone project structure.
```

## Resume Bullet Points

- Added an AWS cloud layer to a medical tourism management platform using API Gateway, Lambda, ECS, S3, and CloudWatch.
- Containerized a Next.js, React, Prisma, and SQLite application for deployment on Amazon ECS.
- Built a simple AWS Lambda function that forwards cloud API requests to existing Next.js API routes.
- Preserved the original Prisma database integration while adding cloud-based request handling.
- Added S3 upload URL support for patient document storage.
- Documented the cloud architecture, deployment plan, demo steps, and portfolio explanation.

## Portfolio Description

This project extends a full-stack medical tourism capstone application with a simple AWS cloud architecture. The original application manages patients, providers, patient profiles, travel information, medical information, and notes using Next.js, React, Prisma, and SQLite. The cloud branch adds ECS container deployment, API Gateway routes, a Lambda cloud API layer, S3 upload support, and CloudWatch logging. The design keeps the existing database and backend logic while showing how a working web application can be deployed and connected to cloud services.

## Milestone README Sections

This README consolidates the milestone README information into one main-branch document. Each milestone section includes its own video walkthrough link.

## Milestone 1 README

Milestone 1 focused on the patient intake foundation for the Medical Tourism Platform.

Completed in Milestone 1:

- Patient data entry.
- Patient intake fields for identity, contact, medical, insurance, appointment, travel, payment, notes, and status information.
- Prisma and SQLite setup for storing patient records.
- Initial API support for creating and retrieving patient data.

Important Milestone 1 files:

- `app/api/user/route.ts` - Patient CRUD API.
- `components/AddPatientModal.tsx` - Add patient modal.
- `components/Fields.ts` - Form field definitions.
- `lib/prisma.ts` - Prisma client setup.
- `prisma/schema.prisma` - Database schema.

### Video Walkthrough

Video link: https://youtu.be/sw-mpkqt8vU

## Milestone 2 README

Milestone 2 expanded the patient intake work into a provider-facing patient management dashboard.

Completed in Milestone 2:

- Patient management dashboard.
- Patient table view.
- Add, edit, and delete patient workflows.
- Continued Prisma and SQLite database integration.
- Reusable dashboard components for patient management.

Important Milestone 2 files:

- `app/patients/page.tsx` - Provider-facing patient dashboard.
- `components/PatientTable.tsx` - Patient table component.
- `components/AddPatientModal.tsx` - Add patient modal.
- `components/EditPatientModal.tsx` - Edit patient modal.
- `app/api/user/route.ts` - Patient CRUD API.

### Video Walkthrough

Video link: https://youtu.be/4Uwi3NalKRQ

Viewing note: This walkthrough was recorded in vertical portrait orientation and is easiest to watch on a phone.

## Milestone 3 README

Milestone 3 expands the app beyond the patient management dashboard by adding basic role-based flows for patients and providers, patient profile editing, and notes connected to patient records.

### Milestone 3 Overview

Milestone 3 demonstrates a more complete workflow:

- Providers can log in and view the patient management dashboard.
- Patients can log in and view their own profile.
- Patient profile data can be edited.
- Notes can be added to a patient profile.
- The app continues to use Prisma and SQLite for database integration.

### Current Progress

Completed in this milestone:

- Patient data entry from Milestone 1.
- Patient management dashboard from Milestone 2.
- Provider login validation.
- Patient login validation.
- Patient profile page at `/profile`.
- Patient detail page structure at `/patients/[id]`.
- Notes API connected to patient records.
- Prisma schema updated with a `Note` model.
- Continued SQLite database integration.

Not finished yet:

- Secure production authentication.
- Password support.
- Full provider account management.
- Deployment.
- Advanced reporting and analytics.
- Travel package builder for clinics, hotels, and flights.

### Technologies Used

- Next.js 16
- React 19
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS
- Node.js and npm

### Important Project Files

- `app/page.tsx` - Login screen with provider and patient login sections.
- `app/patients/page.tsx` - Provider-facing patient dashboard.
- `app/patients/[id]/page.tsx` - Individual patient route.
- `app/profile/page.tsx` - Patient-facing profile page.
- `app/api/user/route.ts` - Patient CRUD API.
- `app/api/auth/provider/route.ts` - Provider login validation API.
- `app/api/auth/patient/route.ts` - Patient login validation API.
- `app/api/notes/route.ts` - Notes API.
- `components/PatientTable.tsx` - Patient table component.
- `components/AddPatientModal.tsx` - Add patient modal.
- `components/EditPatientModal.tsx` - Edit patient modal.
- `components/Login.tsx` - Reusable email login component.
- `components/Fields.ts` - Form field definitions.
- `lib/prisma.ts` - Prisma client setup.
- `prisma/schema.prisma` - Database schema with `Patient`, `Note`, `Provider`, and `User`.

### Database Overview

The database uses SQLite through Prisma. No separate database server is required.

The schema includes:

- `Patient` - Stores patient intake, medical, insurance, appointment, travel, payment, notes, and status fields.
- `Note` - Stores notes connected to a patient by `patientId`.
- `Provider` - Stores provider records. In this milestone, provider login checks the provider `name` field against the login email.
- `User` - Stores general user records for future expansion.

The database connection is configured through:

```env
DATABASE_URL="file:./dev.db"
```

### API Endpoints

#### GET `/api/user`

Returns all patients.

#### POST `/api/user`

Creates a new patient.

#### PATCH `/api/user`

Updates a patient.

#### DELETE `/api/user`

Deletes a patient.

#### GET `/api/auth/provider?email=...`

Checks whether a provider login is valid.

Important detail: this milestone checks the `Provider.name` field against the submitted email.

#### GET `/api/auth/patient?email=...`

Checks whether a patient login is valid and returns the patient id.

#### GET `/api/notes?patientId=...`

Returns notes for one patient.

#### POST `/api/notes`

Creates a note for one patient.

Required body fields:

- `patientId`
- `content`

### How To Run Milestone 3 Step By Step

#### 1. Install prerequisites

Install:

- Node.js 20 or newer.
- npm.
- Git.

Check versions:

```bash
node -v
npm -v
git --version
```

#### 2. Clone the repository

```bash
git clone https://github.com/kmartyxian/Capstone-Project.git
cd Capstone-Project
```

#### 3. Switch to the main branch

```bash
git checkout main
```

#### 4. Install dependencies

```bash
npm install
```

On Windows PowerShell, if `npm` is blocked, use:

```bash
npm.cmd install
```

#### 5. Create the environment file

Create `.env` in the project root:

```env
DATABASE_URL="file:./dev.db"
```

#### 6. Create and sync the database

```bash
npx prisma db push
```

This creates the SQLite database and all tables from `prisma/schema.prisma`.

If Prisma Client needs to be regenerated:

```bash
npx prisma generate
```

#### 7. Add required login data to the database

Milestone 3 login depends on data existing in the SQLite database. The easiest way to add data is Prisma Studio.

Start Prisma Studio:

```bash
npx prisma studio
```

Open the URL shown in the terminal, usually:

```text
http://localhost:5555
```

##### Add a provider login

1. Open the `Provider` table.
2. Add a row.
3. Set `name` to an email-like value, for example:

   ```text
   provider@example.com
   ```

4. Set `location`, for example:

   ```text
   Chicago, IL
   ```

5. Save the row.

Provider login uses the provider `name` field as the login value in this milestone.

##### Add a patient login

1. Open the `Patient` table.
2. Add a row.
3. Set `email`, for example:

   ```text
   patient@example.com
   ```

4. Optional useful fields:

   ```text
   firstName: Test
   lastName: Patient
   phoneNumber: 5551234567
   status: Active
   reasonForVisit: Consultation
   ```

5. Save the row.

Patient login uses the `Patient.email` field.

#### 8. Start the development server

```bash
npm run dev
```

On Windows PowerShell, if needed:

```bash
npm.cmd run dev
```

#### 9. Open the application

Open:

```text
http://localhost:3000
```

### How To Use The Milestone 3 Program

#### Provider login flow

1. Open `http://localhost:3000`.
2. In the Provider Login section, enter the provider value you created in Prisma Studio, such as `provider@example.com`.
3. Click the login button.
4. If the provider exists, the app stores a local session and redirects to `/patients`.
5. On `/patients`, view, add, edit, or delete patient records.

#### Patient login flow

1. Open `http://localhost:3000`.
2. In the Patient Login section, enter a patient email that exists in the database, such as `patient@example.com`.
3. Click the login button.
4. If the patient exists, the app stores a local session and redirects to `/profile`.
5. On `/profile`, view and edit patient information.
6. Add notes in the Notes section.

#### Patient dashboard flow

1. Open `http://localhost:3000/patients`.
2. View all patients.
3. Use **+ Add Patient** to create a record.
4. Use **Edit** to update a record.
5. Use **Delete** to remove a record.

#### Patient notes flow

1. Log in as a patient.
2. Go to `/profile`.
3. Type text in the notes box.
4. Click **Add Note**.
5. The app sends a POST request to `/api/notes`.
6. The note is saved in the `Note` table with the current patient id.

### How To Test The API Manually

Create a patient:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/user `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"firstName":"Test","lastName":"Patient","email":"patient@example.com","status":"Active"}'
```

Create a note after getting a patient id:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/notes `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"patientId":"PASTE_PATIENT_ID_HERE","content":"Patient requested travel follow-up."}'
```

Check provider login:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/provider?email=provider@example.com" -UseBasicParsing
```

Check patient login:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/patient?email=patient@example.com" -UseBasicParsing
```

### Video Walkthrough

Video link: https://youtu.be/Vh8k9aK8GjM

Viewing note: This walkthrough was recorded in vertical portrait orientation and is easiest to watch on a phone.

### Future Plans

- Replace email-only login with secure authentication.
- Add provider account management.
- Add package builder features for clinics, hotels, and flights.
- Add advanced search and filtering.
- Add reports and analytics.
- Improve design and accessibility.
- Deploy the application to a cloud platform.

## Final Milestone README

The final milestone combines the earlier milestone work into the main branch and keeps the project code together in one place. It includes patient intake, the provider patient dashboard, patient and provider login flows, patient profile editing, individual patient routes, and notes connected to patient records.

### Final Milestone Overview

The final milestone demonstrates the completed capstone workflow:

- Providers can log in and manage patient records.
- Patients can log in and view or edit their own profile.
- Patient records can be added, edited, deleted, and reviewed from the dashboard.
- Notes can be created and stored for patient records.
- Prisma and SQLite continue to provide the database layer.
- The project is consolidated on the `main` branch.

### Current Progress

Completed in the final milestone:

- Patient data entry from Milestone 1.
- Patient management dashboard from Milestone 2.
- Role-based patient and provider flows from Milestone 3.
- Patient profile page at `/profile`.
- Patient detail page at `/patients/[id]`.
- Notes API connected to patient records.
- Final README consolidation for all milestone documentation.
- Main branch setup with the final project code.

Not finished yet:

- Secure production authentication.
- Password support.
- Full provider account management.
- Deployment.
- Advanced reporting and analytics.
- Travel package builder for clinics, hotels, and flights.

### Technologies Used

- Next.js 16
- React 19
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS
- Node.js and npm

### Important Project Files

- `app/page.tsx` - Login screen with provider and patient login sections.
- `app/patients/page.tsx` - Provider-facing patient dashboard.
- `app/patients/[id]/page.tsx` - Individual patient route.
- `app/profile/page.tsx` - Patient-facing profile page.
- `app/api/user/route.ts` - Patient CRUD API.
- `app/api/auth/provider/route.ts` - Provider login validation API.
- `app/api/auth/patient/route.ts` - Patient login validation API.
- `app/api/notes/route.ts` - Notes API.
- `components/PatientTable.tsx` - Patient table component.
- `components/AddPatientModal.tsx` - Add patient modal.
- `components/EditPatientModal.tsx` - Edit patient modal.
- `components/Login.tsx` - Reusable email login component.
- `components/Fields.ts` - Form field definitions.
- `lib/prisma.ts` - Prisma client setup.
- `prisma/schema.prisma` - Database schema.

### How To Run The Final Milestone

```bash
git clone https://github.com/kmartyxian/Capstone-Project.git
cd Capstone-Project
git checkout main
npm install
npx prisma db push
npm run dev
```

Open:

```text
http://localhost:3000
```

### Video Demo

Video link: https://youtu.be/AyM8-f9WLmM

### Future Plans

- Replace email-only login with secure authentication.
- Add provider account management.
- Add package builder features for clinics, hotels, and flights.
- Add advanced search and filtering.
- Add reports and analytics.
- Improve design and accessibility.
- Deploy the application to a cloud platform.
