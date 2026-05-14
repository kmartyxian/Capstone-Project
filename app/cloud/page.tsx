"use client";

import { useState } from "react";
import Link from "next/link";

export default function CloudPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Active");
  const [message, setMessage] = useState("");

  const cloudApiUrl = process.env.NEXT_PUBLIC_CLOUD_API_URL || "";

  async function handleSubmit() {
    if (!cloudApiUrl) {
      setMessage("Add NEXT_PUBLIC_CLOUD_API_URL to use the AWS API Gateway endpoint.");
      return;
    }

    if (!firstName.trim() || !email.trim()) {
      setMessage("First name and email are required.");
      return;
    }

    setMessage("Sending request to AWS API Gateway...");

    try {
      const response = await fetch(`${cloudApiUrl}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          status,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessage(errorText || "Cloud request failed.");
        return;
      }

      setFirstName("");
      setLastName("");
      setEmail("");
      setStatus("Active");
      setMessage("Patient request sent through AWS API Gateway and Lambda.");
    } catch {
      setMessage("Cloud request failed.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl rounded bg-white p-6 shadow-sm">
        <Link href="/" className="mb-2 inline-block text-sm text-blue-600 hover:underline">
          Back to Login
        </Link>

        <h1 className="text-2xl font-semibold text-slate-900">Cloud Patient Request</h1>
        <p className="mt-1 text-sm text-slate-600">
          This page sends a new patient request to AWS API Gateway. Lambda then forwards it to the
          same patient API already used by the capstone project.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">First name</label>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Last name</label>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Follow up</option>
            </select>
          </div>
        </div>

        {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          className="mt-6 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Send Cloud Request
        </button>
      </div>
    </div>
  );
}
