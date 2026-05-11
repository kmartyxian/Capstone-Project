"use client";

import { useState } from "react";
import { InfoFields } from "./Fields";

export default function Register({
  role,
  onRegistered,
}: {
  role: "patient" | "provider";
  onRegistered: (email: string, id?: string) => void;
}) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const fields = role === "patient"
    ? InfoFields.patientRegistrationFields
    : [
      { name: "name", label: "Name", placeholder: "Enter name", type: "text" },
      { name: "email", label: "Email", placeholder: "Enter email", type: "email" },
      { name: "code", label: "Registration Code", placeholder: "Enter code", type: "text" },
    ];

  async function handleRegister() {
    setError("");

    let response: Response;

    try {
      response = await fetch(`/api/auth/${role}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      setError("Registration failed. Please try again.");
      return;
    }

    if (!response.ok) {
      const message = await response.text();
      setError(message || "Registration failed.");
      return;
    }

    const data = await response.json();
    setError("");
    onRegistered(data.email, data.patientId || data.providerId);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        {fields.map((field) => (
          <input
            key={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={form[field.name] || ""}
            onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
            className="border p-2 rounded"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleRegister}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Register
      </button>

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}
