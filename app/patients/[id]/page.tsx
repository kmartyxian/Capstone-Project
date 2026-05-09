"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { patientInfoFields } from "@/components/patientFields";

type Patient = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  status?: string | null;
  [key: string]: any;
};

type Note = {
  id: string;
  content: string;
  createdAt: string;
};

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadPatient() {
    const response = await fetch(`/api/user`);
    const patients = await response.json();
    const found = patients.find((p: Patient) => p.id === id);
    if (found) {
      setPatient(found);
      setFormData(found);
    }
    setLoading(false);
  }

  async function loadNotes() {
    const response = await fetch(`/api/notes?patientId=${id}`);
    const data = await response.json();
    setNotes(data);
  }

  useEffect(() => {
    if (id) {
      loadPatient();
      loadNotes();
    }
  }, [id]);

  async function handleSave() {
    if (!patient) return;

    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: patient.id, ...formData }),
    });

    if (response.ok) {
      loadPatient();
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;

    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: id, content: newNote.trim() }),
    });

    if (response.ok) {
      setNewNote("");
      loadNotes();
    }
  }

  if (loading) return <p>Loading...</p>;
  if (!patient) return <p>Patient not found.</p>;

  const sections = [
    { title: "Personal Info", fields: patientInfoFields.personalInfoFields },
    { title: "Address", fields: patientInfoFields.addressFields },
    { title: "Emergency Contact", fields: patientInfoFields.emergencyContactFields },
    { title: "Medical Info", fields: patientInfoFields.medicalInfoFields },
    { title: "Insurance", fields: patientInfoFields.insuranceFields },
    { title: "Appointment", fields: patientInfoFields.appointmentFields },
    { title: "Travel Info", fields: patientInfoFields.travelInfoFields },
    { title: "Payment", fields: patientInfoFields.paymentFields },
    { title: "Login", fields: patientInfoFields.loginFields },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/patients" className="text-blue-600 hover:underline">
            ← Back to Patients
          </Link>
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>

        <div className="rounded bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            {patient.firstName || patient.lastName
              ? `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim()
              : "Unnamed Patient"}
          </h1>
          <p className="text-slate-600">{patient.email}</p>
          {patient.status && <p className="text-sm text-slate-500">Status: {patient.status}</p>}
        </div>

        {sections.map((section) => (
          <div key={section.title} className="rounded bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-slate-900">{section.title}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {section.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-700">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.name]: e.target.value })
                    }
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-slate-900">Notes</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 rounded border border-slate-300 px-3 py-2"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Add Note
              </button>
            </div>
            <div className="space-y-2">
              {notes.map((note) => (
                <div key={note.id} className="rounded border border-slate-200 p-3">
                  <p className="text-sm text-slate-900">{note.content}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
