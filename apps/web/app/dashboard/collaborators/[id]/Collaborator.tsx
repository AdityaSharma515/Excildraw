"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Trash2, 
  ArrowLeft, 
  UserCog,  
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

// Updated to match your SketchFlow brand gradients
const getAvatarStyle = (name: string) => {
  const gradients = [
    "from-violet-500 to-fuchsia-500",
    "from-indigo-500 to-purple-500",
    "from-emerald-400 to-teal-500",
    "from-blue-500 to-cyan-500",
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

  // Updated badges for perfect light/dark mode contrast
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20">Owner</Badge>
      case "editor":
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20">Editor</Badge>
      default:
        return <Badge variant="secondary" className="bg-muted text-muted-foreground border-border hover:bg-muted/80">Viewer</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="mx-auto max-w-3xl px-6 py-12 space-y-8">
        <div className="space-y-6">
          <Button
            variant="ghost"
            className="-ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Board
          </Button>
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Team Members
              </h1>
              <p className="text-muted-foreground font-medium mt-1">
                Manage access and roles for this board.
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Find a member..." 
                className="pl-10 bg-background border-border rounded-xl focus-visible:ring-primary text-foreground shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Replaced bg-white and border-gray-100 with semantic card classes */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden transition-colors">
          {loading ? (
            <div className="p-6 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <Skeleton className="h-11 w-11 rounded-full bg-muted" />
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-muted" />
                        <Skeleton className="h-3 w-48 bg-muted" />
                     </div>
                   </div>
                   <Skeleton className="h-8 w-20 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          ) : filteredCollaborators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl mb-4">
                <UserCog className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No members found</h3>
              <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto mt-2">
                {searchQuery ? "Try adjusting your search terms." : "It's lonely here. Invite someone to collaborate!"}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              <AnimatePresence>
                {filteredCollaborators.map((collaborator) => (
                  <motion.li
                    key={collaborator.user.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                    className="group flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${getAvatarStyle(collaborator.user.name)} text-white font-bold shadow-sm text-lg`}>
                        {collaborator.user.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                          {collaborator.user.name}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mt-0.5">
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
                        <div className="text-xs font-semibold tracking-wider uppercase text-muted-foreground pr-3">
                          Owner
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border rounded-xl shadow-lg">
                            <DropdownMenuItem 
                              className="text-red-500 focus:text-red-600 focus:bg-red-500/10 cursor-pointer rounded-lg my-1"
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