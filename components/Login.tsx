"use client";
import { useState } from "react";

type LoginField = {
    name: string;
    type: string;
    placeholder: string;
};

export default function Login({ fields: loginFields, onLogin }: { fields: LoginField[]; onLogin: (email: string) => void }) {
    const [form, setForm] = useState<Record<string, string>>({});


    async function HandleSubmitToPost() {
        onLogin(form.email || "");

    }

    function GetPatientInfo({ fields }: { fields: LoginField[] }) {
        return fields.map(function (field) {
            return (
                <input
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.name] || ""}
                    onChange={(e) => {
                        setForm({ ...form, [field.name]: e.target.value });
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
    </div>

}
