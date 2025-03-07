'use client'

import { useRouter } from "next/navigation";
import { loginUser } from "~/server/action";
import { useState } from "react";
import { z } from "zod";
import { userSchema } from "~/server/zod-schema";
import Link from "next/link";


interface ValidationErrors {
    [key: string]: string[]
}
  
  export function SignInForm({ previousPath = '/' }: { previousPath?: string }) {
    const router = useRouter()
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)
  
    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        setIsLoading(true)
        setErrors({})

        try {
          const form = event.target as HTMLFormElement
          const formData = new FormData(form)
          const data = Object.fromEntries(formData.entries())
        
          const [error, session] = await loginUser(data as z.infer<typeof userSchema.login>)
        
          if (error instanceof Error) {  
            setErrors({ form: [error.message] })
            return
          }

          router.push(previousPath)
        }
        catch (error) {
          setErrors({ form: ['An unexpected error occurred'] })
        }
        finally {
          setIsLoading(false)
        }
    }
  
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input type="email" name="email" placeholder="Email" />
                </div>

                <div>
                  <input type="password" name="password" placeholder="Password" />
                </div>

                {errors.form?.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm">{error}</p>
                ))}

                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Sign In'}
                </button>

                <div className="flex mt-[40px]">
                  <span>Don’t you have an account?</span>
                  <Link href="/auth/sign-up">Sign Up</Link>
                </div>

                <Link href='/auth/forgot-password'>Forgot password?</Link>
        </form>
    )
  }