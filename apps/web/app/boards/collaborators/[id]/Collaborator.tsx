"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Trash2, 
  ArrowLeft, 
  ShieldCheck, 
  UserCog, 
  Eye, 
  Search,
  MoreVertical,
  Mail
} from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

type Collaborator = {
  user: {
    id: string
    name: string
    email: string
  }
  role: "owner" | "editor" | "viewer"
}

// Helper to get initials and color
const getAvatarStyle = (name: string) => {
  const gradients = [
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
  ]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

const CollaboratorPage = ({ id }: { id: string }) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function fetchCollaborators() {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        const res = await api.get(`${BASE_URL}/users/boards/${id}/collaborators`)
        setCollaborators(res.data.allCollaborators)
      } catch {
        toast.error("Failed to load collaborators")
      } finally {
        setLoading(false)
      }
    }
    fetchCollaborators()
  }, [id])

  async function removeCollaborator(userId: string) {
    // Optimistic UI: Remove visually first
    const previous = [...collaborators]
    setCollaborators((prev) => prev.filter((c) => c.user.id !== userId))

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      await api.delete(`${BASE_URL}/users/boards/${id}/collaborators`,{
        data:{userId}
      })
      toast.success("Access revoked")
    } catch {
      setCollaborators(previous) // Revert on error
      toast.error("Failed to remove collaborator")
    }
  }

  const filteredCollaborators = collaborators.filter(c => 
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">Owner</Badge>
      case "editor":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Editor</Badge>
      default:
        return <Badge variant="secondary">Viewer</Badge>
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner": return <ShieldCheck className="h-4 w-4 text-amber-500" />
      case "editor": return <UserCog className="h-4 w-4 text-blue-500" />
      default: return <Eye className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-6">
          <Button
            variant="ghost"
            className="-ml-2 text-muted-foreground hover:text-gray-900"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Board
          </Button>
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Team Members
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage access and roles for this board.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Find a member..." 
                className="pl-9 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <Skeleton className="h-10 w-10 rounded-full" />
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                     </div>
                   </div>
                   <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : filteredCollaborators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <UserCog className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No members found</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                {searchQuery ? "Try adjusting your search terms." : "It's lonely here. Invite someone to collaborate!"}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredCollaborators.map((collaborator) => (
                  <motion.li
                    key={collaborator.user.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    className="group flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarStyle(collaborator.user.name)} text-white font-medium shadow-sm`}>
                        {collaborator.user.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-900 flex items-center gap-2">
                          {collaborator.user.name}
                          {/* Show icon only on mobile, text on desktop usually, but keeping it clean here */}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {collaborator.user.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Role Badge (Desktop) */}
                      <div className="hidden sm:flex items-center gap-2">
                         {getRoleBadge(collaborator.role)}
                      </div>

                      {/* Actions */}
                      {collaborator.role === "owner" ? (
                        <div className="text-xs text-muted-foreground italic pr-3">
                          Owner
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => removeCollaborator(collaborator.user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default CollaboratorPage