
'use client'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createNewUser } from "~/server/action"
import { userSchema } from "~/server/zod-schema"
import { useState } from "react"
import { ZodError } from "zod"

interface ValidationErrors {
  [key: string]: string[]
}

export function SignUpForm({ previousPath = "/" }: { previousPath?: string }) {
  const router = useRouter()

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    
    try {
      // Client-side validation
      const createInput = userSchema.create.parse(data)
      const [error, createdUser] = await createNewUser(createInput)
      
      if (error) {
        // Handle server-side validation errors
        if (error instanceof ZodError) {
          const formattedErrors: ValidationErrors = {}
          error.errors.forEach((err) => {
            const field = err.path[0] as string
            formattedErrors[field] = formattedErrors[field] || []
            formattedErrors[field].push(err.message)
          })
          setErrors(formattedErrors)
          return
        }
        // Handle other server errors
        setErrors({ form: ['An unexpected error occurred'] })
        return
      }

      // Success - clear errors and redirect
      setErrors({})
      router.push(previousPath)
    } catch (error) {
      // Handle client-side validation errors
      if (error instanceof ZodError) {
        const formattedErrors: ValidationErrors = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as string
          formattedErrors[field] = formattedErrors[field] || []
          formattedErrors[field].push(err.message)
        })
        setErrors(formattedErrors)
        return
      }
      // Handle other client errors
      setErrors({ form: ['An unexpected error occurred'] })
    }
    finally{
        setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="email" placeholder="Email" name="email"/>
          {errors.email?.map((error, index) => (
            <p key={index} className="text-red-500 text-sm">{error}</p>
          ))}
        </div>

        <div>
          <input type="text" placeholder="First Name" name="firstName"/>
          {errors.firstName?.map((error, index) => (
            <p key={index} className="text-red-500 text-sm">{error}</p>
          ))}
        </div>

        <div>
          <input type="text" placeholder="Last Name" name="lastName"/>
          {errors.lastName?.map((error, index) => (
            <p key={index} className="text-red-500 text-sm">{error}</p>
          ))}
        </div>

        <div>
          <input type="password" placeholder="Password" name="password"/>
          {errors.password?.map((error, index) => (
            <p key={index} className="text-red-500 text-sm">{error}</p>
          ))}
        </div>

        <div>
          <input type="password" placeholder="Password Again" name="passwordAgain"/>
          {errors.passwordAgain?.map((error, index) => (
            <p key={index} className="text-red-500 text-sm">{error}</p>
          ))}
        </div>

        {errors.form?.map((error, index) => (
          <p key={index} className="text-red-500 text-sm">{error}</p>
        ))}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>

        <div>
          <span>Already have an account?</span>
          <Link href="/auth/sign-in">Sign In</Link>
        </div>
      </form>
    </div>
  )
}
