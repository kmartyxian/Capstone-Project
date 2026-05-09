# Medical Tourism Platform - Milestone 2

**Name:** Jeremy Wanguhu  
**Course:** CIDS 484  
**Semester:** Spring 2026  
**Repository:** https://github.com/kmartyxian/Capstone-Project  
**Branch:** `milestone-2`

## Project Description

The Medical Tourism Platform is a full-stack web application for managing patients who are coordinating medical care and travel. The system stores patient demographics, medical history, emergency contact information, insurance details, appointment preferences, travel details, notes, and patient status.

Milestone 2 builds on the first patient intake prototype by adding a patient management dashboard. The dashboard gives the user a practical way to view, add, edit, and delete patient records from the SQLite database.

## Milestone 2 Overview

Milestone 2 is the alpha release of the patient management module. The project now has a visible patient table, modal forms for patient creation and editing, delete actions, and API endpoints connected to Prisma and SQLite.

## Assignment Requirements Covered

- Create an overview and outline of the project and push all documentation to the GitHub repository by the due date.
- Create a prototype or code examples that demonstrate the technologies used for the project and push all code to the GitHub repository.
- Update the README file in the GitHub repository.
- Add a description of the project.
- Add a description of the current progress.
- Make sure the README file is organized and easy to read.
- Create a roughly 5 minute video that gives an overview of the project and walks through the outline and code at a high level.
- The video can be created or uploaded with Kaltura, YouTube, or another similar service. UWRF Kaltura help: https://kb.wisconsin.edu/dle/95100

## Current Progress

Completed in this milestone:

- Patient data entry from Milestone 1.
- Prisma ORM and SQLite database integration.
- Patient management dashboard at `/patients`.
- Patient table showing name, email, and status.
- Add patient modal.
- Edit patient modal.
- Delete patient action.
- API routes for GET, POST, PATCH, and DELETE.
- Basic validation and error handling.

Not finished yet:

- Role-based patient/provider login.
- Patient profile page.
- Notes connected to individual patients.
- Production deployment.
- Advanced searching, filtering, and reporting.

## Technologies Used

- Next.js 16
- React 19
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS
- Node.js and npm

## Important Project Files

- `app/page.tsx` - Home page with link to the patient dashboard.
- `app/patients/page.tsx` - Patient management dashboard.
- `app/api/user/route.ts` - API route for patient CRUD operations.
- `components/PatientTable.tsx` - Patient table component.
- `components/AddPatientModal.tsx` - Modal for adding patients.
- `components/EditPatientModal.tsx` - Modal for editing patients.
- `components/AddData.tsx` - Patient data entry form component.
- `components/Login.tsx` - Email login/input component.
- `components/patientFields.ts` - Patient form field definitions.
- `lib/prisma.ts` - Prisma client setup.
- `prisma/schema.prisma` - Database schema.

## Database Overview

The database uses SQLite through Prisma. No separate database server is required.

The main model is `Patient`. It includes:

- Basic patient information.
- Address information.
- Emergency contact information.
- Medical information.
- Insurance information.
- Appointment preferences.
- Travel information.
- Payment information.
- Notes and status.

The app connects to the database through `lib/prisma.ts`, and the API route in `app/api/user/route.ts` uses Prisma to read and write patient records.

## API Endpoints

### GET `/api/user`

Returns all patients in the database.

### POST `/api/user`

Creates a patient.

Example fields:

- `firstName`
- `lastName`
- `email`
- `notes`
- `status`

### PATCH `/api/user`

Updates an existing patient by `id`, `currentEmail`, or email depending on the request body.

### DELETE `/api/user`

Deletes a patient by `id` or email.

## How To Run Milestone 2 Step By Step

### 1. Install prerequisites

Install:

- Node.js 20 or newer.
- npm.
- Git.

Check your versions:

```bash
node -v
npm -v
git --version
```

### 2. Clone the repository

```bash
git clone https://github.com/kmartyxian/Capstone-Project.git
cd Capstone-Project
```

### 3. Switch to the milestone 2 branch

```bash
git checkout milestone-2
```

### 4. Install dependencies

```bash
npm install
```

On Windows PowerShell, if `npm` is blocked, use:

```bash
npm.cmd install
```

### 5. Create the environment file

Create a file named `.env` in the project root:

```env
DATABASE_URL="file:./dev.db"
```

### 6. Create and sync the database

```bash
npx prisma db push
```

This creates the local SQLite database and applies the Prisma schema.

If Prisma Client needs to be regenerated:

```bash
npx prisma generate
```

### 7. Optional: add starter data with Prisma Studio

Open Prisma Studio:

```bash
npx prisma studio
```

Then open the Prisma Studio URL, usually:

```text
http://localhost:5555
```

Add rows in the `Patient` table. At minimum, each patient needs a unique `email`. Useful sample fields:

- `firstName`: Amara
- `lastName`: Okafor
- `email`: amara.okafor@example.com
- `phoneNumber`: 3125550184
- `status`: Active
- `reasonForVisit`: Orthopedic consultation
- `country`: United States

Save the row, then return to the app.

### 8. Start the development server

```bash
npm run dev
```

On Windows PowerShell, if needed:

```bash
npm.cmd run dev
```

### 9. Open the application

Open:

```text
http://localhost:3000
```

Then click **Open Patients** to go to:

```text
http://localhost:3000/patients
```

## How To Use The Milestone 2 Program

### View patients

1. Open `http://localhost:3000/patients`.
2. The table loads patient records from the SQLite database through `/api/user`.

### Add a patient

1. Click **+ Add Patient**.
2. Enter first name, last name, email, notes, and status.
3. Click **Save**.
4. The app sends a POST request to `/api/user`.
5. The table refreshes and shows the new patient.

### Edit a patient

1. Click **Edit** on a patient row.
2. Change the patient details.
3. Click **Save**.
4. The app sends a PATCH request to `/api/user`.
5. The table refreshes with the updated information.

### Delete a patient

1. Click **Delete** on a patient row.
2. Confirm the browser prompt.
3. The app sends a DELETE request to `/api/user`.
4. The patient is removed from the database.

## How To Test The API Manually

Create a patient:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/user `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"firstName":"Test","lastName":"Patient","email":"test.patient@example.com","status":"Active","notes":"Created from API test"}'
```

Get all patients:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/user -UseBasicParsing
```

Update a patient:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/user `
  -Method PATCH `
  -ContentType "application/json" `
  -Body '{"currentEmail":"test.patient@example.com","status":"Follow up"}'
```

Delete a patient:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/user `
  -Method DELETE `
  -ContentType "application/json" `
  -Body '{"email":"test.patient@example.com"}'
```

## Video Walkthrough Plan

The 5 minute video should cover:

1. Project purpose and medical tourism use case.
2. Milestone 2 progress compared to Milestone 1.
3. How the app is structured.
4. How Prisma and SQLite are connected.
5. Live demo of adding, editing, and deleting a patient.
6. Quick code walkthrough of the dashboard, modals, API route, and Prisma schema.
7. Future work planned for later milestones.

## Future Plans

- Add provider and patient login.
- Add individual patient profile pages.
- Add notes attached to patients.
- Add search and filtering.
- Add reporting and analytics.
- Deploy the app to a cloud platform.
