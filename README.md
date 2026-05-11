# Medical Tourism Platform - Milestone 3

**Name:** Jeremy Wanguhu  
**Course:** CIDS 484  
**Semester:** Spring 2026  
**Repository:** https://github.com/kmartyxian/Capstone-Project  
**Branch:** `milestone-3`

## Project Description

The Medical Tourism Platform is a full-stack web application for managing patients who are coordinating medical care and travel. The system stores patient demographics, medical history, emergency contact information, insurance details, appointment preferences, travel details, notes, and patient status.

Milestone 3 builds on the patient management dashboard from Milestone 2 by adding separate provider and patient login flows. Providers can access the patient dashboard, while patients can access their own profile page. The milestone also adds individual patient detail pages and patient-specific notes.

## Milestone 3 Overview

Milestone 3 is the role-based access and patient profile release. The project now has provider login, patient login, route protection through local browser session data, patient profile editing, provider-facing patient detail pages, and notes connected to individual patients through Prisma and SQLite.

## Current Progress

Completed in this milestone:

- Patient data entry from Milestone 1.
- Patient management dashboard from Milestone 2.
- Prisma ORM and SQLite database integration.
- Provider login from the home page.
- Patient login from the home page.
- Provider dashboard access at `/patients`.
- Patient profile page at `/profile`.
- Individual patient detail pages at `/patients/[id]`.
- Patient-specific notes through `/api/notes`.
- Editable full patient profile sections.
- Basic route protection using `localStorage` session data.
- API routes for patient login, provider login, patient CRUD, and notes.

Not finished yet:

- Secure password-based authentication.
- Real account registration.
- Server-side session management.
- Production deployment.
- Advanced searching, filtering, and reporting.
- Provider email field cleanup in the database schema.

## Technologies Used

- Next.js 16
- React 19
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS
- Node.js and npm

## Important Project Files

- `app/page.tsx` - Home page with provider and patient login forms.
- `app/patients/page.tsx` - Provider patient management dashboard.
- `app/patients/[id]/page.tsx` - Provider-facing patient detail and notes page.
- `app/profile/page.tsx` - Patient-facing profile page.
- `app/api/user/route.ts` - API route for patient CRUD operations.
- `app/api/auth/provider/route.ts` - API route for provider login validation.
- `app/api/auth/patient/route.ts` - API route for patient login validation.
- `app/api/notes/route.ts` - API route for patient-specific notes.
- `components/PatientTable.tsx` - Patient table component.
- `components/AddPatientModal.tsx` - Modal for adding patients.
- `components/EditPatientModal.tsx` - Modal for editing patients.
- `components/AddData.tsx` - Patient data entry form component.
- `components/Login.tsx` - Reusable email login/input component.
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

Milestone 3 also uses:

- `Note` - Stores patient-specific notes connected to a patient by `patientId`.
- `Provider` - Stores provider records used for provider login validation.

The app connects to the database through `lib/prisma.ts`. The API route in `app/api/user/route.ts` reads and writes patient records, while `app/api/notes/route.ts` reads and creates notes for individual patients.

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

### GET `/api/auth/provider`

Checks whether a provider exists.

Example query:

```text
/api/auth/provider?email=provider@example.com
```

### GET `/api/auth/patient`

Checks whether a patient exists by email and returns the patient id when valid.

Example query:

```text
/api/auth/patient?email=amara.okafor@example.com
```

### GET `/api/notes`

Returns notes for a patient by `patientId`.

Example query:

```text
/api/notes?patientId=PATIENT_ID_HERE
```

### POST `/api/notes`

Creates a note for a patient.

Example fields:

- `patientId`
- `content`

## How To Run Milestone 3 Step By Step

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

### 3. Switch to the milestone 3 branch

```bash
git checkout milestone-3
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

### 7. Add starter data with Prisma Studio

Open Prisma Studio:

```bash
npx prisma studio
```

Then open the Prisma Studio URL, usually:

```text
http://localhost:5555
```

Add at least one row in the `Patient` table. At minimum, each patient needs a unique `email`. Useful sample fields:

- `firstName`: Amara
- `lastName`: Okafor
- `email`: amara.okafor@example.com
- `phoneNumber`: 3125550184
- `status`: Active
- `reasonForVisit`: Orthopedic consultation
- `country`: United States

Add at least one row in the `Provider` table. In this milestone, provider login checks the `name` field:

- `name`: provider@example.com
- `location`: Chicago

Save the rows, then return to the app.

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

Use the provider login to go to:

```text
http://localhost:3000/patients
```

Use the patient login to go to:

```text
http://localhost:3000/profile
```

## How To Use The Milestone 3 Program

### Login as a provider

1. Open `http://localhost:3000`.
2. Enter a provider value that exists in the `Provider.name` database field.
3. Submit the provider login form.
4. The app stores a provider session in `localStorage`.
5. The provider is sent to `/patients`.

### View patients as a provider

1. Login as a provider.
2. Open `http://localhost:3000/patients`.
3. The table loads patient records from SQLite through `/api/user`.

### Add a patient

1. Click **+ Add Patient**.
2. Enter first name, last name, email, notes, and status.
3. Click **Save**.
4. The app sends a POST request to `/api/user`.
5. The table refreshes and shows the new patient.

### Edit a patient from the dashboard

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

### View and edit a patient detail page

1. Login as a provider.
2. Open a patient detail page at `/patients/[id]`.
3. Review or edit the patient's personal, address, emergency contact, medical, insurance, appointment, travel, payment, and login fields.
4. Click **Save Changes**.
5. The app sends a PATCH request to `/api/user`.

### Add notes to a patient

1. Open a patient detail page or patient profile page.
2. Type a note in the notes box.
3. Click **Add Note**.
4. The app sends a POST request to `/api/notes`.
5. The note appears in the notes list for that patient.

### Login as a patient

1. Open `http://localhost:3000`.
2. Enter an email that exists in the `Patient.email` database field.
3. Submit the patient login form.
4. The app stores a patient session in `localStorage`.
5. The patient is sent to `/profile`.

### Update the patient profile

1. Login as a patient.
2. Open `http://localhost:3000/profile`.
3. Update profile fields.
4. Click **Save Changes**.
5. The app sends a PATCH request to `/api/user`.

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

Check patient login:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/patient?email=test.patient@example.com" -UseBasicParsing
```

Check provider login:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/auth/provider?email=provider@example.com" -UseBasicParsing
```

Update a patient:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/user `
  -Method PATCH `
  -ContentType "application/json" `
  -Body '{"currentEmail":"test.patient@example.com","status":"Follow up"}'
```

Create a note:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/notes `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"patientId":"PATIENT_ID_HERE","content":"Follow-up note from API test"}'
```

Get notes:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/notes?patientId=PATIENT_ID_HERE" -UseBasicParsing
```

Delete a patient:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/user `
  -Method DELETE `
  -ContentType "application/json" `
  -Body '{"email":"test.patient@example.com"}'
```

## Video Walkthrough

Video link: https://youtu.be/Vh8k9aK8GjM

Viewing note: This walkthrough was recorded in vertical portrait orientation and is easiest to watch on a phone.

## Future Plans

- Add secure password-based login.
- Add real provider and patient account registration.
- Move authentication from `localStorage` to server-side sessions.
- Add provider email fields instead of using the provider name field for login.
- Add search and filtering.
- Add reporting and analytics.
- Deploy the app to a cloud platform.
