# Medical Tourism Platform

**Name:** Jeremy Wanguhu  
**Course:** CIDS 484  
**Semester:** Spring 2026

## Description

The Medical Tourism Platform is a full-stack web application built to help manage patients and medical tourism services. The system allows users to create patient profiles, store medical and travel information, and manage healthcare-related workflows in one place.

This project is designed to simplify coordination between patients, clinics, and travel services by providing a centralized platform for managing important data and processes.

## Milestone 2 - Alpha Release

### Current Status

The project now includes a fully functional **Patient Management Module (Module 2)** with a working user interface for managing patients.

### Features Implemented & Working

#### Module 1 - Patient Data Entry

- ✅ Patient creation form with validation
- ✅ API routes for patient data management
- ✅ Prisma ORM integration with SQLite database
- ✅ Form validation for all patient fields

#### Module 2 - Patient Management Dashboard (Alpha)

- ✅ **View All Patients** - Display all patients in a clean table format
- ✅ **Create Patient** - Add new patients with modal form (Name, Email, Notes, Status)
- ✅ **Edit Patient** - Update patient information with pre-filled modal forms
- ✅ **Delete Patient** - Remove patients with confirmation
- ✅ **Real-time UI Updates** - Immediate table refresh after any operation
- ✅ **Responsive Table Layout** - Patient list with Name, Email, Status columns
- ✅ **Error Handling** - Validation messages for form inputs
- ✅ **Home Button** - Quick access link from homepage to patient dashboard

### Project Structure

```
app/
  ├── page.tsx                    # Home page with link to patients
  ├── patients/
  │   └── page.tsx               # Patient management dashboard
  ├── api/user/
  │   └── route.ts               # API endpoints (GET, POST, PATCH, DELETE)
  └── globals.css

components/
  ├── PatientTable.tsx           # Patient list table component
  ├── AddPatientModal.tsx        # Add patient form modal
  ├── EditPatientModal.tsx       # Edit patient form modal
  ├── AddData.tsx                # Data entry form
  └── Login.tsx                  # Login component

prisma/
  ├── schema.prisma              # Database schema with Patient model
  └── migrations/                # Database migration history

lib/
  └── prisma.ts                  # Prisma client setup
```

### How to Access the Features

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Navigate to the homepage:**
   - Open `http://localhost:3000`
   - Click the **"Open Patients"** button

3. **Patient Management Dashboard:**
   - **View patients:** All patients load automatically in a table
   - **Add patient:** Click `+ Add Patient` button, fill form, click Save
   - **Edit patient:** Click `Edit` button in patient row, update fields, click Save
   - **Delete patient:** Click `Delete` button, confirm in prompt

### Technologies Used

- Next.js (16.1.6)
- React (19.2.3)
- Prisma ORM (6.19.2)
- SQLite
- Node.js
- TypeScript
- Tailwind CSS

### API Endpoints

#### GET `/api/user`

Returns all patients in the database.

#### POST `/api/user`

Creates a new patient with provided data fields.

#### PATCH `/api/user`

Updates an existing patient by email or ID.

#### DELETE `/api/user`

Deletes a patient by email or ID.

### Database Schema

The `Patient` model includes:

- Basic info: firstName, lastName, email, dateOfBirth, gender, phoneNumber
- Address: streetAddress, city, state, zipCode, country
- Medical: bloodType, allergies, currentMedications, medicalConditions, pastSurgeries
- Emergency contact information
- Insurance details
- Appointment preferences
- Travel information
- Payment information
- **New fields:** notes, status

### Branches

- **main** - Default branch
- **module-1** - Initial patient data entry system
- **module-2** - Patient management dashboard with full CRUD operations (current alpha)

### Future Plans

- Adding authentication and user accounts
- Implementing clinic and hotel service management
- Building package builder for travel and medical services
- Enhanced reporting and analytics
- Deployment to AWS or cloud platform
- Advanced search and filtering capabilities
- Multi-user collaboration features

## How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/kmartyxian/Capstone-Project.git
   cd Capstone-Project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   ```bash
   npx prisma db push
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Video Demonstration

A ~5 minute video demonstrating the project features and code walkthrough has been recorded and should be uploaded to the GitHub repository. The video covers:

- Project overview and purpose
- Features implemented in Module 2
- Live demonstration of patient management operations
- Database schema and API design
- Code walkthrough of key components

## Repository

GitHub: https://github.com/kmartyxian/Capstone-Project
