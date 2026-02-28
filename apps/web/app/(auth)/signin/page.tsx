"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { useState } from "react"
import Link from "next/link"

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
  const router = useRouter()
  
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
    // Updated background to dynamic bg-background
    <div className="min-h-screen flex items-center justify-center bg-background px-4 font-sans transition-colors duration-300">
      
      {/* Updated Card to use bg-card and border-border */}
      <Card className="w-full max-w-md shadow-2xl border border-border bg-card rounded-2xl overflow-hidden transition-colors">
        <CardHeader className="space-y-3 text-center pt-10 pb-6">
          {/* Changed hardcoded violet to bg-primary */}
          <div className="mx-auto bg-primary w-12 h-12 rounded-xl flex items-center justify-center shadow-md mb-2">
             <svg className="w-7 h-7 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
             </svg>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground font-medium">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-6">
          {/* Google Button updated for dark mode compatibility */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-background hover:bg-accent hover:text-accent-foreground text-foreground border-border font-semibold rounded-xl transition-all shadow-sm"
            onClick={handleGoogleSignIn}>
            <FcGoogle className="mr-3 h-5 w-5" />
            Sign in with Google
          </Button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              {/* Changed Separator background to border-border */}
              <Separator className="w-full bg-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              {/* Background must match Card background (bg-card) to mask the line behind it */}
              <span className="bg-card px-4 text-muted-foreground font-bold tracking-wider">
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
                    <FieldLabel className="text-sm font-semibold text-foreground">Email Address</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      // Input fully mapped to semantic vars
                      className="h-12 rounded-xl border-border bg-background text-foreground focus-visible:ring-primary focus-visible:ring-offset-0"
                      placeholder="you@example.com"
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
                    <div className="flex items-center justify-between">
                      <FieldLabel className="text-sm font-semibold text-foreground">Password</FieldLabel>
                      {/* Brand-aware link colors */}
                      <Link href="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      {...field}
                      type="password"
                      // Input fully mapped to semantic vars
                      className="h-12 rounded-xl border-border bg-background text-foreground focus-visible:ring-primary focus-visible:ring-offset-0"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} className="text-destructive text-xs mt-1" />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {/* Primary Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-lg hover:shadow-xl transition-all mt-4 text-base"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground font-medium mt-6">
            Don't have an account?{" "}
            {/* Brand-aware link colors */}
            <Link href="/signup" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}