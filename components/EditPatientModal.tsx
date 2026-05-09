"use client";
import { useEffect, useState } from "react";

type Patient = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  notes?: string | null;
  status?: string | null;
};

export default function EditPatientModal({
  patient,
  onClose,
  onSaved,
}: {
  patient: Patient;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [firstName, setFirstName] = useState(patient.firstName ?? "");
  const [lastName, setLastName] = useState(patient.lastName ?? "");
  const [email, setEmail] = useState(patient.email);
  const [notes, setNotes] = useState(patient.notes ?? "");
  const [status, setStatus] = useState(patient.status ?? "Active");
  const [error, setError] = useState("");

  useEffect(() => {
    setFirstName(patient.firstName ?? "");
    setLastName(patient.lastName ?? "");
    setEmail(patient.email);
    setNotes(patient.notes ?? "");
    setStatus(patient.status ?? "Active");
  }, [patient]);

  async function handleSave() {
    if (!firstName.trim() || !email.trim()) {
      setError("First name and email are required.");
      return;
    }

    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: patient.id,
        currentEmail: patient.email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        notes: notes.trim() || null,
        status,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      setError(message || "Unable to save patient.");
      return;
    }

    setError("");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4">
      <div className="w-full max-w-lg rounded bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Edit Patient</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-900">
            Close
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">First name</label>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Last name</label>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Follow up</option>
            </select>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-300 px-4 py-2 text-sm text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
