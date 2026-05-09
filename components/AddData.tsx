"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addressFields, appointmentFields, emergencyContactFields, insuranceFields, medicalInfoFields, patientInfoFields, paymentFields, personalInfoFields, travelInfoFields } from "./patientFields";
import HandleSubmitToPost from "./Login";
import GetEmail from "./Login";

export default function AddData({ fields, email }: { fields: any[]; email: string }) {
    const [error, setError] = useState("");
    const router = useRouter();
    const [form, setform] = useState<any>([]);


    async function HandleSubmitToPatch() {
        const formObj = Object.fromEntries(fields.map((field, i) => [field.name, form[i]]));
        console.log("loggedInEmail", email, "formObj", formObj);
        const res = await fetch(`/api/user`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, ...formObj }),
        });

       const data = await res.json();
       console.log(data);


        if (!res.ok) {
            const errorDate = await res.text();
            setError(errorDate);
            router.refresh();
            
            

        } else {
            
            setError("");

            router.refresh();

        }


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
            {GetPatientInfo({ fields })}
        </form>

        <button
            onClick={HandleSubmitToPatch}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Submit
        </button>
        {error && <p className="text-red-500">{error}</p>}
        <p></p>
    </div>

}