"use client";
import { useState } from "react";
import { resetPassword } from "~/server/action";
import { userSchema } from "~/server/zod-schema";

type ResetPasswordFormProps = {
  email: string;
  token: string;
}

export default function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    try {
      const resetData = {
        email,
        token,
        password: formData.get("password") as string,
        passwordAgain: formData.get("passwordAgain") as string
      };
      
      userSchema.resetPassword.parse(resetData);
      await resetPassword(resetData);
      window.location.href = '/auth/sign-in';
    } catch (err) {
      setError('Failed to reset password');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-[200px] mb-[500px]">
        <h1 className="text-2xl font-bold text-center mb-4">Reset Password</h1>
    
        <div className="text-sm text-gray-500 mb-4">
          Email: <span className="font-semibold">{email}</span>
        </div>
    
        <form action={handleSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    minLength={6}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
            
        
                <div>
                  <label htmlFor="passwordAgain" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    name="passwordAgain"
                    id="passwordAgain"
                    required
                    minLength={6}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
            
        
                <div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Reset Password
                  </button>
                </div>
        </form>
  </div>);

}