"use client";

import AddData from "@/components/AddData";
import { patientInfoFields } from "@/components/patientFields";
import Login from "@/components/Login";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
    const [loggedInEmail, setLoggedInEmail] = useState("");

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Welcome</h1>
                <Link
                    href="/patients"
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Open Patients
                </Link>
            </div>

            <Login fields={patientInfoFields.loginFields} onLogin={setLoggedInEmail} />
            <AddData fields={patientInfoFields.personalInfoFields} email={loggedInEmail} />
            <p>logged in as: {loggedInEmail}</p>
        </div>
    );
}
