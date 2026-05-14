"use client";

import { InfoFields } from "@/components/Fields";
import Login from "@/components/Login";
import Register from "@/components/Register";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const [providerError, setProviderError] = useState("");
    const [patientError, setPatientError] = useState("");
    const [providerRegister, setProviderRegister] = useState(false);
    const [patientRegister, setPatientRegister] = useState(false);

    async function handleProviderLogin(email: string) {
        setProviderError("");

        if (!email) {
            setProviderError("Enter a provider email");
            return;
        }

        let data;

        try {
            const response = await fetch(`/api/auth/provider?email=${encodeURIComponent(email)}`);
            data = await response.json();
        } catch {
            setProviderError("Provider login failed. Please try again.");
            return;
        }

        if (data.valid) {
            localStorage.setItem("session", JSON.stringify({ role: "provider", email }));
            router.push("/patients");
        } else {
            setProviderError("Invalid provider email");
        }
    }

    async function handlePatientLogin(email: string) {
        setPatientError("");

        if (!email) {
            setPatientError("Enter a patient email");
            return;
        }

        let data;

        try {
            const response = await fetch(`/api/auth/patient?email=${encodeURIComponent(email)}`);
            data = await response.json();
        } catch {
            setPatientError("Patient login failed. Please try again.");
            return;
        }

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
                        <h2 className="mb-4 text-lg font-medium text-slate-900">
                            Provider {providerRegister ? "Register" : "Login"}
                        </h2>
                        {providerRegister ? (
                            <Register
                                role="provider"
                                onRegistered={(email) => {
                                    localStorage.setItem("session", JSON.stringify({ role: "provider", email }));
                                    setProviderRegister(false);
                                    setProviderError("");
                                }}
                            />
                        ) : (
                            <Login
                                fields={InfoFields.loginFields}
                                onLogin={(email) => {
                                    handleProviderLogin(email);
                                }}
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => setProviderRegister(!providerRegister)}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                        >
                            {providerRegister ? "Back to login" : "Register"}
                        </button>
                        {providerError && <p className="mt-2 text-sm text-rose-600">{providerError}</p>}
                    </div>

                    <div className="rounded bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-medium text-slate-900">
                            Patient {patientRegister ? "Register" : "Login"}
                        </h2>
                        {patientRegister ? (
                            <Register
                                role="patient"
                                onRegistered={(email, patientId) => {
                                    localStorage.setItem("session", JSON.stringify({ role: "patient", email, patientId }));
                                    setPatientRegister(false);
                                    setPatientError("");
                                }}
                            />
                        ) : (
                            <Login
                                fields={InfoFields.loginFields}
                                onLogin={(email) => {
                                    handlePatientLogin(email);
                                }}
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => setPatientRegister(!patientRegister)}
                            className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                        >
                            {patientRegister ? "Back to login" : "Register"}
                        </button>
                        {patientError && <p className="mt-2 text-sm text-rose-600">{patientError}</p>}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
                    <Link
                        href="/cloud"
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Cloud Request
                    </Link>
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
