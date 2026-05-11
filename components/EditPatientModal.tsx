"use client";
import { useState } from "react";
import { InfoFields } from "./Fields";

type Patient = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  notes?: string | null;
  status?: string | null;
} & Record<string, string | null | undefined>;

type Field = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
};

const sections: { title: string; fields: Field[] }[] = [
  { title: "Personal Info", fields: InfoFields.personalInfoFields },
  { title: "Address", fields: InfoFields.addressFields },
  { title: "Emergency Contact", fields: InfoFields.emergencyContactFields },
  { title: "Medical Info", fields: InfoFields.medicalInfoFields },
  { title: "Insurance", fields: InfoFields.insuranceFields },
  { title: "Appointment", fields: InfoFields.appointmentFields },
  { title: "Travel Info", fields: InfoFields.travelInfoFields },
  { title: "Payment", fields: InfoFields.paymentFields },
  { title: "Login", fields: InfoFields.loginFields },
];

export default function EditPatientModal({
  patient,
  onClose,
  onSaved,
}: {
  patient: Patient;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [formData, setFormData] = useState<Record<string, string | null | undefined>>(patient);
  const [error, setError] = useState("");

  function formatInputValue(fieldName: string, fieldType: string) {
    const value = formData[fieldName];

    if (!value) return "";
    if (fieldType === "date" && value.includes("T")) return value.slice(0, 10);

    return value;
  }

  function updateField(fieldName: string, value: string) {
    setFormData({ ...formData, [fieldName]: value });
  }

  async function handleSave() {
    const firstName = formData.firstName?.trim() || "";
    const email = formData.email?.trim() || "";

    if (!firstName || !email) {
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
        ...formData,
        firstName,
        email,
        lastName: formData.lastName?.trim() || null,
        notes: formData.notes?.trim() || null,
        status: formData.status || "Active",
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
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded bg-white shadow-lg">
        <div className="mb-4 flex items-center justify-between px-6 pt-6">
          <h2 className="text-lg font-semibold text-slate-900">Edit Patient</h2>
          <button type="button" onClick={onClose} className="text-slate-500 hover:text-slate-900">
            Close
          </button>
        </div>

        <div className="max-h-[calc(90vh-150px)] space-y-6 overflow-y-auto px-6">
          {sections.map((section) => (
            <section key={section.title}>
              <h3 className="mb-3 text-base font-semibold text-slate-900">{section.title}</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-slate-700">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formatInputValue(field.name, field.type)}
                      onChange={(event) => updateField(field.name, event.target.value)}
                      className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h3 className="mb-3 text-base font-semibold text-slate-900">Notes and Status</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  value={formData.notes || ""}
                  onChange={(event) => updateField("notes", event.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select
                  value={formData.status || "Active"}
                  onChange={(event) => updateField("status", event.target.value)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Follow up</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {error && <p className="mt-4 px-6 text-sm text-rose-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
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
