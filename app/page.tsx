"use client";

import PatientList from "@/components/PatientList";
import AddData from "@/components/AddData";
import prisma from "@/lib/prisma";
import { patientInfoFields } from "@/components/patientFields";
import Login from "@/components/Login";
import { use, useState } from "react";

export default function Page() {
    const [loggedInEmail, setLoggedInEmail] = useState("");

    return (



        <div>
            <Login fields={patientInfoFields.loginFields} onLogin={setLoggedInEmail} />
            <AddData fields={patientInfoFields.personalInfoFields} email={loggedInEmail} />
            <p>logged in as: {loggedInEmail}</p>
        </div>

    )

}