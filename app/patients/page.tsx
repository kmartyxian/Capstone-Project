"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddPatientModal from "@/components/AddPatientModal";
import EditPatientModal from "@/components/EditPatientModal";
import PatientTable from "@/components/PatientTable";

type Patient = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  notes?: string | null;
  status?: string | null;
};

export default function Page() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (!session) {
      router.push("/");
      return;
    }

    const { role } = JSON.parse(session);
    if (role !== "provider") {
      router.push("/");
      return;
    }

    loadPatients();
  }, [router]);

  async function loadPatients() {
    setLoading(true);
    const response = await fetch("/api/user");
    const data = await response.json();
    setPatients(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl rounded bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="mb-2 inline-block text-sm text-blue-600 hover:underline">
              Back to Login
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900">Patients</h1>
            <p className="mt-1 text-sm text-slate-600">View, add, edit, and remove patients quickly.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/cloud"
              className="inline-flex items-center justify-center rounded border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Cloud Request
            </Link>
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Add Patient
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-600">Loading patients...</p>
        ) : (
          <PatientTable
            patients={patients}
            onEdit={(patient) => setEditPatient(patient)}
            onDeleted={loadPatients}
          />
        )}
      </div>

      {showAdd && (
        <AddPatientModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            loadPatients();
          }}
        />
      )}

      {editPatient && (
        <EditPatientModal
          patient={editPatient}
          onClose={() => setEditPatient(null)}
          onSaved={() => {
            setEditPatient(null);
            loadPatients();
          }}
        />
      )}
    </div>
  );
}
