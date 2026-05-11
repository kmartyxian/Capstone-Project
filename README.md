# Medical Tourism Platform

**Name:** Jeremy Wanguhu  
**Course:** CIDS 484  
**Semester:** Spring 2026  
**Repository:** https://github.com/kmartyxian/Capstone-Project  
**Branch:** `main`

## Project Description

The Medical Tourism Platform is a full-stack web application for managing the patient side and provider side of a medical tourism workflow. It stores patient intake information, medical history, emergency contacts, insurance details, appointment preferences, travel details, notes, and patient status.

The final version combines the work from the milestone branches into one main branch. The app includes patient intake, a provider-facing patient management dashboard, patient and provider login flows, patient profile editing, and notes connected to patient records.

## Final Presentation

Final presentation video: https://youtu.be/AyM8-f9WLmM

## Milestone README Sections

This README consolidates the milestone README information into one main-branch document. The extracted project contained one README for Milestone 3; the Milestone 1 and Milestone 2 sections below are separated from the completed progress described in the final milestone documentation.

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

Milestone 3 walkthrough video: https://youtu.be/Vh8k9aK8GjM

### Future Plans

- Replace email-only login with secure authentication.
- Add provider account management.
- Add package builder features for clinics, hotels, and flights.
- Add advanced search and filtering.
- Add reports and analytics.
- Improve design and accessibility.
- Deploy the application to a cloud platform.
