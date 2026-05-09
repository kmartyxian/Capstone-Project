"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function ProfilePage() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (!session) {
      router.push("/");
      return;
    }

    const { role, email, patientId } = JSON.parse(session);
    if (role !== "patient" || !email) {
      router.push("/");
      return;
    }

    loadPatient(email);
    if (patientId) loadNotes(patientId);
  }, [router]);

  async function loadPatient(email: string) {
    setLoading(true);
    const response = await fetch("/api/user");
    const patients = await response.json();
    const found = patients.find((p: Patient) => p.email === email);
    if (found) {
      setPatient(found);
      setFormData(found);
    }
    setLoading(false);
  }

  async function loadNotes(patientId: string) {
    const response = await fetch(`/api/notes?patientId=${patientId}`);
    const data = await response.json();
    setNotes(data);
  }

  async function handleSave() {
    if (!patient) return;

    const response = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: patient.id, ...formData }),
    });

    if (response.ok) {
      loadPatient(patient.email);
    }
  }

  async function handleAddNote() {
    if (!newNote.trim() || !patient) return;

    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: patient.id, content: newNote.trim() }),
    });

    if (response.ok) {
      setNewNote("");
      loadNotes(patient.id);
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
          <h1 className="text-2xl font-semibold text-slate-900">My Profile</h1>
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>

        <div className="rounded bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            {patient.firstName || patient.lastName
              ? `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim()
              : "Unnamed Patient"}
          </h2>
          <p className="text-slate-600">{patient.email}</p>
          {patient.status && <p className="text-sm text-slate-500">Status: {patient.status}</p>}
        </div>

        {sections.map((section) => (
          <div key={section.title} className="rounded bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-slate-900">{section.title}</h3>
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
          <h3 className="mb-4 text-lg font-medium text-slate-900">Notes</h3>
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