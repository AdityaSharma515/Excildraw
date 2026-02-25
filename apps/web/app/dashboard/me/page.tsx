"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { 
  User, 
  Mail, 
  ShieldCheck, 
  ArrowLeft,
  LogOut,
  Copy,
  Check
} from "lucide-react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

// Define the shape of your user data
type UserProfile = {
  id: string
  name: string
  email: string
  role?: string
  createdAt?: string 
}

export default function ViewProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchMyProfile() {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        const res = await api.get(`${BASE_URL}/auth/me`) 
        setUser(res.data.currentuser)
      } catch (error) {
        toast.error("Could not load profile information")
      } finally {
        setLoading(false)
      }
    }

    fetchMyProfile()
  }, [])

  async function handleLogout() {
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        await api.post(`${BASE_URL}/auth/logout`)
        toast.success("Logged out successfully")
        router.push("/signin")
    } catch (error) {
        toast.error("Unable to logout");
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("ID copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  // Updated to use brand-aligned purples/indigos/fuchsias instead of random colors
  const getAvatarGradient = (name: string = "U") => {
    const gradients = [
      "from-violet-500 to-fuchsia-500",
      "from-indigo-500 to-purple-500",
      "from-purple-500 to-pink-500",
      "from-violet-600 to-indigo-600",
    ]
    const index = name.charCodeAt(0) % gradients.length
    return gradients[index]
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            className="-ml-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden shadow-xl shadow-primary/5 border-border bg-card rounded-2xl transition-all">
          {loading ? (
             <div className="p-8 space-y-6">
               <div className="flex items-center gap-6">
                 <Skeleton className="h-28 w-28 rounded-full" />
                 <div className="space-y-3">
                   <Skeleton className="h-8 w-48" />
                   <Skeleton className="h-5 w-32" />
                 </div>
               </div>
               <Skeleton className="h-[1px] w-full" />
               <div className="space-y-4 pt-4">
                 <Skeleton className="h-16 w-full rounded-xl" />
                 <Skeleton className="h-16 w-full rounded-xl" />
                 <Skeleton className="h-16 w-full rounded-xl" />
               </div>
             </div>
          ) : !user ? (
            <div className="p-12 text-center text-muted-foreground font-medium">
              Failed to load user data.
            </div>
          ) : (
            <>
              {/* Brand-aligned Top Banner */}
              <div className={`h-36 w-full bg-gradient-to-r ${getAvatarGradient(user.name)} opacity-90`} />
              
              <CardContent className="px-6 sm:px-10 pb-10">
                {/* Avatar & Role Header */}
                <div className="relative -mt-16 mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                  <div className={`flex h-32 w-32 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br ${getAvatarGradient(user.name)} text-5xl font-extrabold text-white shadow-lg shrink-0`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex flex-col sm:items-end pb-2">
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">{user.name}</h1>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-sm font-semibold rounded-full border-0">
                         {user.role || "Member"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Personal Information</h2>
                </div>

                {/* Data Rows */}
                <div className="space-y-3">
                  
                  {/* Name Row */}
                  <div className="flex items-center p-4 bg-background rounded-xl border border-border/60 shadow-sm transition-colors hover:border-border">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary mr-4 shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Full Name</p>
                      <p className="font-semibold text-foreground text-base">{user.name}</p>
                    </div>
                  </div>

                  {/* Email Row */}
                  <div className="flex items-center p-4 bg-background rounded-xl border border-border/60 shadow-sm transition-colors hover:border-border">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary mr-4 shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Email Address</p>
                      <p className="font-semibold text-foreground text-base">{user.email}</p>
                    </div>
                  </div>

                  {/* ID Row with Copy Feature */}
                  <div className="flex items-center p-4 bg-background rounded-xl border border-border/60 shadow-sm transition-colors hover:border-border group">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary mr-4 shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Account ID</p>
                      <p className="font-medium text-foreground text-sm truncate pr-4 font-mono">{user.id}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copyToClipboard(user.id)}
                      className="shrink-0 text-muted-foreground hover:text-primary hover:bg-primary/10 h-9 w-9 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                      title="Copy ID"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="mt-10 pt-6 border-t border-border flex justify-end">
                  <Button 
                    variant="ghost" 
                    className="text-red-500 hover:bg-red-500/10 hover:text-red-600 font-semibold rounded-xl px-6 h-11 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>

              </CardContent>
            </>
          )}
        </Card>

      </div>
    </div>
  )
}