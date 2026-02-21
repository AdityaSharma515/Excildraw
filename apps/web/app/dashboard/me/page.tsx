"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  ArrowLeft,
  LogOut
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
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
  const router = useRouter()

  useEffect(() => {
    async function fetchMyProfile() {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        // Assuming you have an endpoint that returns the currently logged-in user
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
    // Add your logout logic here (clear tokens, cookies, etc.)
    try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        await api.post(`${BASE_URL}/auth/logout`)
        toast.success("Logged out successfully")
        router.push("/signin")
    } catch (error) {
        toast.error("Unable to logout");
    }
  }

  // Helper to generate a nice gradient based on the user's name
  const getAvatarGradient = (name: string = "U") => {
    const gradients = [
      "from-blue-500 to-indigo-500",
      "from-emerald-400 to-teal-500",
      "from-rose-400 to-red-500",
      "from-amber-400 to-orange-500",
    ]
    const index = name.charCodeAt(0) % gradients.length
    return gradients[index]
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="-ml-4 text-muted-foreground hover:text-gray-900"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden shadow-sm border-gray-200 bg-white">
          {loading ? (
             <div className="p-8 space-y-6">
               <div className="flex items-center gap-6">
                 <Skeleton className="h-24 w-24 rounded-full" />
                 <div className="space-y-3">
                   <Skeleton className="h-6 w-48" />
                   <Skeleton className="h-4 w-32" />
                 </div>
               </div>
               <Skeleton className="h-[1px] w-full" />
               <div className="space-y-4">
                 <Skeleton className="h-12 w-full" />
                 <Skeleton className="h-12 w-full" />
               </div>
             </div>
          ) : !user ? (
            <div className="p-12 text-center text-muted-foreground">
              Failed to load user data.
            </div>
          ) : (
            <>
              {/* Colorful Top Banner */}
              <div className={`h-32 w-full bg-gradient-to-r ${getAvatarGradient(user.name)} opacity-90`} />
              
              <CardContent className="px-8 pb-8">
                {/* Avatar overlapping the banner */}
                <div className="relative -mt-16 mb-6 flex justify-between items-end">
                  <div className={`flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br ${getAvatarGradient(user.name)} text-5xl font-bold text-white shadow-md`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <Badge variant="secondary" className="mb-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 text-sm">
                     {user.role || "Member"}
                  </Badge>
                </div>

                <div className="space-y-1 mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-muted-foreground text-lg">Personal Information</p>
                </div>

                {/* Data Rows */}
                <div className="space-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  
                  {/* Name Row */}
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 mr-4 shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                    </div>
                  </div>

                  {/* Email Row */}
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mr-4 shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  {/* Account Type Row */}
                  <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mr-4 shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Account Role</p>
                      <p className="font-semibold text-gray-900 capitalize">{user.role || "Standard User"}</p>
                    </div>
                  </div>

                </div>

                {/* Bottom Actions */}
                <div className="mt-8 flex justify-end">
                  <Button 
                    variant="destructive" 
                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-none"
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