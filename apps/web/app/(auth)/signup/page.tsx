"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

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
      router.push('/dashboard') // Redirect to dashboard after signup
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
    // Updated background to dynamic bg-background
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      
      {/* Updated Card to match the SignInPage perfectly */}
      <Card className="w-full max-w-md shadow-2xl border border-border bg-card rounded-2xl overflow-hidden transition-colors">
        <CardHeader className="space-y-3 text-center pt-10 pb-6">
          {/* Brand Logo Header */}
          <div className="mx-auto bg-primary w-12 h-12 rounded-xl flex items-center justify-center shadow-md mb-2">
             <svg className="w-7 h-7 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
             </svg>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">
            Create an account
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground font-medium">
            Sign up to start collaborating on your boards
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 space-y-6">
          {/* Google Button updated for dark mode compatibility */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-background hover:bg-accent hover:text-accent-foreground text-foreground border-border font-semibold rounded-xl transition-all shadow-sm"
            onClick={handleGoogleSignup}>
            <FcGoogle className="mr-3 h-5 w-5" />
            Continue with Google
          </Button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              {/* Background matched to Card background to mask the separator */}
              <span className="bg-card px-4 text-muted-foreground font-bold tracking-wider">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FieldGroup className="space-y-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-semibold text-foreground">Full Name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="h-12 rounded-xl border-border bg-background text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 transition-all"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-destructive text-xs mt-1" />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-semibold text-foreground">Email Address</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      className="h-12 rounded-xl border-border bg-background text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 transition-all"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-destructive text-xs mt-1" />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="space-y-1.5">
                    <FieldLabel className="text-sm font-semibold text-foreground">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-12 pr-10 rounded-xl border-border bg-background text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 transition-all"
                        aria-invalid={fieldState.invalid}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-destructive text-xs mt-1" />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Primary Submit Button matching the SignInPage pill shape */}
            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl transition-all mt-6 text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        
        {/* Helper Footer Link */}
        <CardFooter className="flex justify-center border-t border-border p-6 mt-2 bg-muted/20">
          <p className="text-sm text-muted-foreground font-medium">
            Already have an account?{" "}
            <Link 
              href="/signin" 
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}