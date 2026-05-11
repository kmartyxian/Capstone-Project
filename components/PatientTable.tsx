"use client";

import Link from "next/link";

type Patient = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  status?: string | null;
} & Record<string, string | number | boolean | null | undefined>;

const patientColumns = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "phoneNumber", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "streetAddress", label: "Street Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zipCode", label: "Zip Code" },
  { key: "country", label: "Country" },
  { key: "emergencyContactName", label: "Emergency Contact" },
  { key: "emergencyContactPhone", label: "Emergency Phone" },
  { key: "emergencyContactRelationship", label: "Emergency Relationship" },
  { key: "bloodType", label: "Blood Type" },
  { key: "allergies", label: "Allergies" },
  { key: "currentMedications", label: "Current Medications" },
  { key: "medicalConditions", label: "Medical Conditions" },
  { key: "pastSurgeries", label: "Past Surgeries" },
  { key: "insuranceProvider", label: "Insurance Provider" },
  { key: "policyNumber", label: "Policy Number" },
  { key: "groupNumber", label: "Group Number" },
  { key: "preferredDate", label: "Preferred Date" },
  { key: "preferredTime", label: "Preferred Time" },
  { key: "reasonForVisit", label: "Reason For Visit" },
  { key: "passportNumber", label: "Passport Number" },
  { key: "nationality", label: "Nationality" },
  { key: "arrivalDate", label: "Arrival Date" },
  { key: "departureDate", label: "Departure Date" },
  { key: "hotelPreference", label: "Hotel Preference" },
  { key: "cardholderName", label: "Cardholder Name" },
  { key: "cardNumber", label: "Card Number" },
  { key: "expirationDate", label: "Expiration Date" },
  { key: "cvv", label: "CVV" },
  { key: "billingAddress", label: "Billing Address" },
  { key: "notes", label: "Notes" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created" },
  { key: "updatedAt", label: "Updated" },
];

export default function PatientTable({
  patients,
  onEdit,
  onDeleted,
}: {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDeleted: () => void;
}) {
  function formatValue(patient: Patient, key: string) {
    const value = patient[key];

    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (key === "dateOfBirth" || key === "createdAt" || key === "updatedAt") {
      const date = new Date(String(value));

      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    }

    return String(value);
  }

  function getPatientName(patient: Patient) {
    return patient.firstName || patient.lastName
      ? `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim()
      : "Unnamed patient";
  }

  async function handleDelete(patient: Patient) {
    if (!confirm(`Delete ${patient.firstName || patient.email}?`)) {
      return;
    }

    const response = await fetch("/api/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: patient.id }),
    });

    if (response.ok) {
      onDeleted();
    }
  }

  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            <th className="sticky left-0 z-10 whitespace-nowrap bg-slate-100 px-4 py-3 text-left font-semibold">
              Name
            </th>
            {patientColumns.map((column) => (
              <th key={column.key} className="whitespace-nowrap px-4 py-3 text-left font-semibold">
                {column.label}
              </th>
            ))}
            <th className="sticky right-0 z-10 whitespace-nowrap bg-slate-100 px-4 py-3 text-left font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={patientColumns.length + 2} className="px-4 py-6 text-slate-600">
                No patients found.
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id} className="border-t border-slate-200 last:border-b">
                <td className="sticky left-0 z-10 whitespace-nowrap bg-white px-4 py-4 text-slate-900">
                  <Link
                    href={`/patients/${patient.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {getPatientName(patient)}
                  </Link>
                </td>
                {patientColumns.map((column) => (
                  <td
                    key={column.key}
                    className="max-w-64 whitespace-nowrap px-4 py-4 text-slate-900"
                    title={formatValue(patient, column.key)}
                  >
                    <span className="block max-w-64 overflow-hidden text-ellipsis">
                      {formatValue(patient, column.key)}
                    </span>
                  </td>
                ))}
                <td className="sticky right-0 z-10 bg-white px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(patient)}
                      className="rounded bg-slate-200 px-3 py-1 text-sm text-slate-900 hover:bg-slate-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(patient)}
                      className="rounded bg-rose-500 px-3 py-1 text-sm text-white hover:bg-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
