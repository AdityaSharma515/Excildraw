"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion" // highly recommended for UI polish
import { Search, LayoutGrid, List as ListIcon } from "lucide-react"
import CreateBoardDialog from "./CreateBoardDialog"
import api from "@/lib/api"
import { BoardCard } from "@/components/BoardCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import AddCollaborator from "./AddCollaborator"

type Board = {
  id: string
  title: string
  isPublic: boolean
  createdAt?: string // Assuming you might have this
}

export default function DashboardPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true) // Start true
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)
  const [collabOpen, setCollabOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  const router = useRouter()

  useEffect(() => {
    async function getBoards() {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        const response = await api.get(`${BASE_URL}/boards`)
        setBoards(response.data.boards)
      } catch (error) {
        console.error("Failed to fetch boards")
      } finally {
        setLoading(false)
      }
    }
    getBoards()
  }, [])

  async function deleteboard(id: string) {
    if (!confirm("Are you sure you want to delete this board?")) return

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!BASE_URL) throw new Error("Backend URL not found")
      
      // Optimistic UI update: Remove immediately from state
      setBoards(prev => prev.filter(b => b.id !== id))
      
      await api.delete(`${BASE_URL}/boards/${id}`)
      router.refresh()
      toast.success("Board deleted successfully")
    } catch (error) {

      toast.error("Unable to delete board")

    }
  }

  // Filter boards based on search
  const filteredBoards = boards.filter(board => 
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your projects and collaborate with your team.
            </p>
          </div>
          <div className="flex items-center gap-2">
             <CreateBoardDialog />
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* Controls Section (Search & Filter) */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boards..."
              className="pl-9 bg-white border-gray-200 focus-visible:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredBoards.length} {filteredBoards.length === 1 ? 'Board' : 'Boards'}
          </div>
        </div>

        {selectedBoardId && (
          <AddCollaborator
            boardId={selectedBoardId}
            open={collabOpen}
            onOpenChange={setCollabOpen}
          />
        )}

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-40 w-full rounded-xl bg-gray-200" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px] bg-gray-200" />
                  <Skeleton className="h-4 w-[200px] bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBoards.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 py-24 text-center"
          >
            <div className="rounded-full bg-gray-100 p-4 mb-4">
              {searchQuery ? <Search className="h-8 w-8 text-gray-400" /> : <LayoutGrid className="h-8 w-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {searchQuery ? "No matching boards found" : "No boards created yet"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              {searchQuery 
                ? "Try adjusting your search terms." 
                : "Create your first board to start visualizing your workflow."}
            </p>
            {!searchQuery && <CreateBoardDialog />}
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredBoards.map((board, index) => (
                <motion.div
                  key={board.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <BoardCard
                    id={board.id}
                    title={board.title}
                    isPublic={board.isPublic}
                    onDelete={() => deleteboard(board.id)}
                    onCollaborate={() => {
                      setSelectedBoardId(board.id)
                      setCollabOpen(true)
                    }}
                    onJoin={(id) => {
                      router.push(`/canvas/${id}`)
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}