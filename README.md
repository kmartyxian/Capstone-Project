# Medical Tourism Platform

## Description
This project is a full-stack web application designed to support the medical tourism industry. It allows agencies to manage patient information, medical data, and travel logistics in one centralized system.

The goal is to create a scalable and user-friendly platform that improves organization and workflow for both agencies and patients.

---

## Project Outline

### Goals
- Build a system to manage medical tourism patients
- Store medical, personal, and travel information
- Create a centralized workflow platform for agencies
- Develop a scalable full-stack application

### Core Features
- Patient profile creation and management
- Form handling and validation
- API routes for backend communication
- Database integration for persistent data storage

### System Architecture
- **Frontend:** Next.js + React
- **Backend:** Next.js API routes
- **Database:** SQLite using Prisma ORM

---

## Technologies Used
- Next.js
- React
- Prisma ORM
- SQLite
- Node.js

---

## Current Progress
- Built patient creation system
- Implemented form handling and validation
- Created API routes (GET, POST)
- Connected frontend to backend
- Integrated Prisma database
- Built UI components for patient data management

This represents the foundational structure of the application and demonstrates working full-stack functionality.

---

## Prototype / Code Examples

- `/app/api/user/route.ts`  
  Handles API requests for creating and retrieving patient data.

- `/components/AddData.tsx`  
  React component that renders the patient form and submits data to the backend.

- `/prisma/schema.prisma`  
  Defines the database schema and structure for storing patient information.

---

## Future Plans
- Add authentication system (login/signup)
- Build package builder (clinics, hotels, flights)
- Improve UI/UX design
- Expand database structure
- Deploy application to a cloud service (AWS)

---

## Demo Video
https://youtu.be/sw-mpkqt8vU

---

## How to Run
1. Clone the repository
2. Install dependencies:
   npm install
3. Run the development server:
   npm run dev
4. Open in browser:
   http://localhost:3000
