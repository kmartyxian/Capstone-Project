# Medical Tourism Platform - Milestone 1

**Name:** Jeremy Wanguhu  
**Course:** CIDS 484  
**Semester:** Spring 2026  
**Repository:** https://github.com/kmartyxian/Capstone-Project  
**Branch:** `milestone1`

## Project Description

The Medical Tourism Platform is a full-stack web application for organizing patient information, medical details, travel information, appointment preferences, and payment details for people seeking medical care while traveling. The goal is to keep the patient intake process, medical history, and travel coordination data in one centralized system.

This project uses a Next.js frontend, API routes for backend operations, Prisma ORM, and a SQLite database. Milestone 1 focuses on proving the core technology stack and building the first patient data entry workflow.

## Milestone 1 Overview

Milestone 1 creates the project outline and first working prototype. The application includes a patient login/data-entry flow, a Prisma schema, API routes, and form components that demonstrate how patient information will be collected and stored.

## Current Progress

Completed in this milestone:

- Created the Next.js application structure.
- Added patient data entry fields for personal, address, emergency contact, medical, insurance, appointment, travel, and payment information.
- Added API route support for creating, reading, updating, and deleting patient data.
- Added Prisma ORM integration.
- Added a SQLite database schema.
- Added early frontend components for login and patient data entry.

Not finished yet:

- Patient management dashboard.
- Provider/patient role-based login.
- Notes and profile pages.
- Production deployment.

## Technologies Used

- Next.js 16
- React 19
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS
- Node.js and npm

## Important Project Files

- `app/page.tsx` - Main page with login and patient data entry.
- `app/api/user/route.ts` - API route for patient database operations.
- `components/Login.tsx` - Login form component.
- `components/AddData.tsx` - Patient data entry form component.
- `components/patientFields.ts` - Field definitions for the patient forms.
- `lib/prisma.ts` - Prisma client setup.
- `prisma/schema.prisma` - Database schema.

## Database Overview

The database uses SQLite through Prisma. The main model is `Patient`.

The `Patient` model stores:

- Basic patient information: first name, last name, email, phone number, date of birth, gender.
- Address information.
- Emergency contact information.
- Medical information such as allergies, medications, blood type, and conditions.
- Insurance information.
- Appointment preferences.
- Travel information.
- Payment information.

SQLite is a local file-based database, so no separate database server is required.

## How To Run Milestone 1 Step By Step

### 1. Install prerequisites

Install these before running the project:

- Node.js 20 or newer.
- npm, which comes with Node.js.
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

### 3. Switch to the milestone 1 branch

```bash
git checkout milestone1
```

### 4. Install dependencies

```bash
npm install
```

On Windows PowerShell, if `npm` is blocked by script execution policy, use:

```bash
npm.cmd install
```

### 5. Create the environment file

Create a file named `.env` in the root of the project and add:

```env
DATABASE_URL="file:./dev.db"
```

This tells Prisma to use a local SQLite database file.

### 6. Create and sync the database

Run:

```bash
npx prisma db push
```

This reads `prisma/schema.prisma` and creates the SQLite database tables.

If Prisma Client needs to be regenerated, run:

```bash
npx prisma generate
```

### 7. Start the development server

```bash
npm run dev
```

On Windows PowerShell, if needed:

```bash
npm.cmd run dev
```

### 8. Open the application

Open this URL in a browser:

```text
http://localhost:3000
```

## How To Use The Milestone 1 Prototype

1. Open `http://localhost:3000`.
2. Enter an email address in the login field.
3. Click the login button.
4. Fill in the patient data fields shown on the page.
5. Submit the form.
6. The app sends the information to the API route in `app/api/user/route.ts`.
7. Prisma stores the information in the local SQLite database.

## How To View Or Edit Database Data

Use Prisma Studio:

```bash
npx prisma studio
```

Then open the Prisma Studio URL that appears in the terminal, usually:

```text
http://localhost:5555
```

In Prisma Studio:

1. Select the `Patient` table.
2. View existing patient rows.
3. Add a row manually if needed.
4. Edit fields such as email, name, phone number, medical conditions, or travel dates.
5. Save the changes.

## How To Test The API Manually

After the app is running, you can create a patient with a POST request.

Example using PowerShell:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/user `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"patient1@example.com","firstName":"Test","lastName":"Patient","phoneNumber":"5551234567"}'
```

Then check all patients:

```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/user -UseBasicParsing
```

## Video Walkthrough

Video link: https://youtu.be/sw-mpkqt8vU

## Future Plans

- Add a patient management dashboard.
- Add create, edit, and delete controls for patients.
- Add provider and patient authentication flows.
- Add notes and patient profile pages.
- Improve the user interface.
- Deploy the application to a cloud hosting platform.
