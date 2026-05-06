"use client";

import { patientInfoFields } from "@/components/patientFields";
import Login from "@/components/Login";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const [providerEmail, setProviderEmail] = useState("");
    const [patientEmail, setPatientEmail] = useState("");
    const [providerError, setProviderError] = useState("");
    const [patientError, setPatientError] = useState("");

    async function handleProviderLogin(email: string) {
        const response = await fetch(`/api/auth/provider?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.valid) {
            localStorage.setItem("session", JSON.stringify({ role: "provider", email }));
            router.push("/patients");
        } else {
            setProviderError("Invalid provider email");
        }
    }

    async function handlePatientLogin(email: string) {
        const response = await fetch(`/api/auth/patient?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.valid) {
            localStorage.setItem("session", JSON.stringify({ role: "patient", email, patientId: data.patientId }));
            router.push("/profile");
        } else {
            setPatientError("Invalid patient email");
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-2xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold text-slate-900">Medical Tourism Platform</h1>
                    <p className="mt-2 text-slate-600">Login to access your dashboard</p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-medium text-slate-900">Provider Login</h2>
                        <Login
                            fields={patientInfoFields.loginFields}
                            onLogin={(email) => {
                                setProviderEmail(email);
                                handleProviderLogin(email);
                            }}
                        />
                        {providerError && <p className="mt-2 text-sm text-rose-600">{providerError}</p>}
                    </div>

                    <div className="rounded bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-medium text-slate-900">Patient Login</h2>
                        <Login
                            fields={patientInfoFields.loginFields}
                            onLogin={(email) => {
                                setPatientEmail(email);
                                handlePatientLogin(email);
                            }}
                        />
                        {patientError && <p className="mt-2 text-sm text-rose-600">{patientError}</p>}
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="/patients"
                        className="text-sm text-slate-600 hover:text-slate-900"
                    >
                        Test: Open Patients (no auth)
                    </Link>
                </div>
            </div>
        </div>
    );
}
