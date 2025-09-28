

"use client";

import { useState } from "react";
import { requestPasswordReset } from "~/server/action";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); 
    setError(null); 
    setSuccessMessage(null); 

    try {
      await requestPasswordReset(email);
      setSuccessMessage("A reset link has been sent to your email.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-[200px] mb-[600px] p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        {error && (
          <div className="text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="text-green-600 bg-green-100 p-2 rounded">
            {successMessage}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}
