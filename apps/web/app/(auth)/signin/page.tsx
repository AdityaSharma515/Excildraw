"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useState } from "react"
import Link from "next/link" // Added for the sign-up link

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import api from "@/lib/api"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password should have at least 6 characters")
    .max(15, "Password must have at most 15 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
})

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const router =useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true)
    const toastId = toast.loading("Signing in...")

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!BASE_URL) throw new Error("Backend URL not found")

      await api.post(`${BASE_URL}/auth/signin`, data)

      toast.success("Signed in successfully 🎉", {
        id: toastId,
      })
      form.reset()
      router.push('/dashboard')
      
    } catch (error) {
      console.error(error)
      toast.error("Failed to sign in. Please check your credentials.", {
        id: toastId,
      })
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleSignIn() {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!BASE_URL) return
    window.location.href = `${BASE_URL}/auth/google`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans">
      <Card className="w-full max-w-md shadow-2xl border-0 ring-1 ring-slate-100 rounded-2xl overflow-hidden">
        <CardHeader className="space-y-3 text-center pt-10 pb-6">
          <div className="mx-auto bg-violet-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md mb-2">
             <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
             </svg>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-slate-500 font-medium">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-6">
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-semibold rounded-xl transition-all shadow-sm"
            onClick={handleGoogleSignIn}>
            <FcGoogle className="mr-3 h-5 w-5" />
            Sign in with Google
          </Button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold tracking-wider">
                Or sign in with email
              </span>
            </div>
          </div>
          
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FieldGroup className="space-y-4">
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-semibold text-slate-700">Email Address</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      className="h-12 rounded-xl border-slate-200 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                      placeholder="you@example.com"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-red-500 text-xs mt-1" />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <FieldLabel className="text-sm font-semibold text-slate-700">Password</FieldLabel>
                      {/* Optional: Forgot password link */}
                      <Link href="/forgot-password" className="text-xs font-semibold text-violet-600 hover:text-violet-700">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      {...field}
                      type="password"
                      className="h-12 rounded-xl border-slate-200 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-red-500 text-xs mt-1" />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all mt-4 text-base"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-slate-500 font-medium mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-violet-600 hover:text-violet-700 font-semibold">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}