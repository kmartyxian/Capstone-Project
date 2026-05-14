"use client";

import { useState } from "react";
import Link from "next/link";

export default function CloudPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Active");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadKey, setUploadKey] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);

  const cloudApiUrl = process.env.NEXT_PUBLIC_CLOUD_API_URL || "";
  const [apiUrl, setApiUrl] = useState(cloudApiUrl);

  async function handleSubmit() {
    if (!apiUrl.trim()) {
      setMessage("Add NEXT_PUBLIC_CLOUD_API_URL to use the AWS API Gateway endpoint.");
      return;
    }

    if (!firstName.trim() || !email.trim()) {
      setMessage("First name and email are required.");
      return;
    }

    setMessage("Sending request to AWS API Gateway...");

    try {
      const response = await fetch(`${apiUrl.trim()}/patients`, {
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

  async function handleUpload() {
    if (!apiUrl.trim()) {
      setUploadMessage("Add NEXT_PUBLIC_CLOUD_API_URL to use the AWS API Gateway endpoint.");
      return;
    }

    if (!file) {
      setUploadMessage("File is required.");
      return;
    }

    setUploadMessage("Getting S3 upload URL...");
    setUploadKey("");
    setUploadDone(false);

    try {
      const response = await fetch(`${apiUrl.trim()}/uploads/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type || "application/octet-stream",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setUploadMessage(errorText || "Unable to get upload URL.");
        return;
      }

      const data = await response.json();

      const uploadResponse = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        setUploadMessage("File upload failed.");
        return;
      }

      setFile(null);
      setFileInputKey(fileInputKey + 1);
      setUploadKey(data.key);
      setUploadMessage("File uploaded to S3.");
      setUploadDone(true);
    } catch {
      setUploadMessage("File upload failed.");
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

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700">AWS API Gateway URL</label>
          <input
            value={apiUrl}
            onChange={(event) => setApiUrl(event.target.value)}
            placeholder="https://your-api-gateway-url.com"
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
          />
          <p className="mt-1 text-sm text-slate-600">
            This uses NEXT_PUBLIC_CLOUD_API_URL when it is saved in the environment file.
          </p>
        </div>

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

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-semibold text-slate-900">S3 File Upload</h2>
          <p className="mt-1 text-sm text-slate-600">
            Upload a patient document by getting an S3 upload URL from AWS Lambda.
          </p>

          <div className="mt-6 space-y-4">
            {!uploadDone && (
              <div>
                <label className="block text-sm font-medium text-slate-700">File</label>
                <input
                  key={fileInputKey}
                  type="file"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                />
              </div>
            )}
          </div>

          {uploadMessage && <p className="mt-4 text-sm text-slate-600">{uploadMessage}</p>}
          {uploadKey && <p className="mt-2 text-sm text-slate-600">S3 key: {uploadKey}</p>}

          {!uploadDone && (
            <button
              type="button"
              onClick={handleUpload}
              className="mt-6 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Upload File
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
