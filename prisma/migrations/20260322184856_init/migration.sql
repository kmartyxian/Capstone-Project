/*
  Warnings:

  - You are about to drop the column `currentConditions` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `familyMedicalHistory` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `medicationDosages` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `surgeryDates` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "gender" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "streetAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "emergencyContactRelationship" TEXT,
    "bloodType" TEXT,
    "allergies" TEXT,
    "currentMedications" TEXT,
    "medicalConditions" TEXT,
    "pastSurgeries" TEXT,
    "insuranceProvider" TEXT,
    "policyNumber" TEXT,
    "groupNumber" TEXT,
    "preferredDate" TEXT,
    "preferredTime" TEXT,
    "reasonForVisit" TEXT,
    "passportNumber" TEXT,
    "nationality" TEXT,
    "arrivalDate" TEXT,
    "departureDate" TEXT,
    "hotelPreference" TEXT,
    "cardholderName" TEXT,
    "cardNumber" TEXT,
    "expirationDate" TEXT,
    "cvv" TEXT,
    "billingAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Patient" ("allergies", "bloodType", "city", "createdAt", "currentMedications", "dateOfBirth", "email", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship", "firstName", "id", "lastName", "pastSurgeries", "phoneNumber", "state", "streetAddress", "zipCode") SELECT "allergies", "bloodType", "city", "createdAt", "currentMedications", "dateOfBirth", "email", "emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship", "firstName", "id", "lastName", "pastSurgeries", "phoneNumber", "state", "streetAddress", "zipCode" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
