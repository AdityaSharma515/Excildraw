"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name should have at least 3 characters")
    .max(15, "Name must have at most 15 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password should have at least 6 characters")
    .max(15, "Password must have at most 15 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
})

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true)
    const toastId = toast.loading("Creating your account...")

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!BASE_URL) throw new Error("Backend URL not found")

      await api.post(`${BASE_URL}/auth/signup`, data)

      toast.success("Account created successfully 🎉", {
        id: toastId,
      })
      form.reset()
    } catch (error) {
      console.error(error)
      toast.error("Failed to create account. Please try again.", {
        id: toastId,
      })
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleSignup() {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!BASE_URL) return
    window.location.href = `${BASE_URL}/auth/google`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl border-gray-100/50 bg-white/80 backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
            Create an account
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sign up to start collaborating on your boards
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 bg-white hover:bg-gray-50 text-gray-900 font-medium"
            onClick={handleGoogleSignup}>
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-muted-foreground font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-gray-700">Full Name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="h-11 transition-all focus-visible:ring-indigo-500"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-gray-700">Email Address</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      className="h-11 transition-all focus-visible:ring-indigo-500"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-gray-700">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 pr-10 transition-all focus-visible:ring-indigo-500"
                        aria-invalid={fieldState.invalid}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button
              type="submit"
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white transition-all mt-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        
        {/* Helper Footer Link */}
        <CardFooter className="flex justify-center border-t border-gray-100 p-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}