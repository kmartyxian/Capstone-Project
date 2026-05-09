"use client";

import Link from "next/link";

type Patient = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  status?: string | null;
};

export default function PatientTable({
  patients,
  onEdit,
  onDeleted,
}: {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDeleted: () => void;
}) {
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
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">Name</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">Email</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">Status</th>
            <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-slate-600">
                No patients found.
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr key={patient.id} className="border-t border-slate-200 last:border-b">
                <td className="px-4 py-4 text-slate-900">
                  <Link
                    href={`/patients/${patient.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {patient.firstName || patient.lastName
                      ? `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim()
                      : "Unnamed patient"}
                  </Link>
                </td>
                <td className="px-4 py-4 text-slate-900">{patient.email}</td>
                <td className="px-4 py-4 text-slate-900">{patient.status ?? "Active"}</td>
                <td className="px-4 py-4">
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
