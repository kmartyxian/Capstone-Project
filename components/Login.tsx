"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addressFields, appointmentFields, emergencyContactFields, insuranceFields, medicalInfoFields, patientInfoFields, paymentFields, personalInfoFields, travelInfoFields } from "./patientFields";

export default function Login({ fields: loginFields, onLogin }: { fields: any[]; onLogin: (email: string) => void }) {
    const [error, setError] = useState("");
    const router = useRouter();
    const [form, setform] = useState<any>([]);
    const [email, setEmail] = useState("");


    async function HandleSubmitToPost() {
        const formObj = Object.fromEntries(
            loginFields.map((field: any, i: number) => [field.name, form[i]])
        );
        
        const res = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObj),
        });

        onLogin(formObj.email);




        if (!res.ok) {
            const errorData = await res.text();
            setError(errorData);

        } else {
            setError("");

            router.refresh();

        }

    }

    function GetEmail() {
        return email;
    }

    function GetPatientInfo({ fields }: { fields: any[] }) {
        return fields.map(function (field, i) {
            return (
                <input
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[i] || ""}
                    onChange={(e) => {

                        const formArr = [...form];
                        formArr[i] = e.target.value;
                        setform(formArr);
                    }
                    }

                    className="border p-2 rounded"
                />
            );
        });
    }


    return <div className="flex flex-col gap-3 max-w-sm">
        <form className="flex flex-col gap-3">
            {GetPatientInfo({ fields: loginFields })}
        </form>

        <button
            onClick={HandleSubmitToPost}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Login
        </button>
        {error && <p className="text-red-500">{error}</p>}
    </div>

}