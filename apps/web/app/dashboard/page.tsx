"use client"

import { useEffect, useState } from "react"
import { Search, FolderOpen, LayoutGrid } from "lucide-react"
import CreateBoardDialog from "./CreateBoardDialog"
import api from "@/lib/api"
import { BoardCard } from "@/components/BoardCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import AddCollaborator from "./AddCollaborator"

type Board = {
  id: string
  title: string
  isPublic: boolean
  createdAt?: string 
}

export default function DashboardPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(true)
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
      
      setBoards(prev => prev.filter(b => b.id !== id))
      
      await api.delete(`${BASE_URL}/boards/${id}`)
      router.refresh()
      toast.success("Board deleted successfully")
    } catch (error) {
      toast.error("Unable to delete board")
    }
  }

  const filteredBoards = boards.filter(board => 
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 md:p-10 pb-20 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header & Controls Row - Much cleaner without the white box! */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium text-base">
            Manage your projects and collaborate with your team.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search boards..."
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl shadow-sm focus-visible:ring-violet-500 text-slate-700 font-medium transition-all w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <CreateBoardDialog />
          </div>
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
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
              <Skeleton className="h-32 w-full rounded-xl bg-slate-100" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-3/4 bg-slate-100" />
                <Skeleton className="h-4 w-1/2 bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBoards.length === 0 ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/50 py-28 text-center mt-8">
          <div className="rounded-2xl bg-violet-50 p-5 mb-5 shadow-sm border border-violet-100">
            {searchQuery ? <Search className="h-10 w-10 text-violet-600" /> : <LayoutGrid className="h-10 w-10 text-violet-600" />}
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {searchQuery ? "No matching boards found" : "No boards created yet"}
          </h3>
          <p className="mt-2 text-base text-slate-500 max-w-sm mx-auto mb-8 font-medium">
            {searchQuery 
              ? "Try adjusting your search terms to find what you're looking for." 
              : "Create your first board to start visualizing your workflow."}
          </p>
          {!searchQuery && <CreateBoardDialog />}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBoards.map((board, index) => (
            <div
              key={board.id}
              className="animate-in fade-in zoom-in-95 duration-500 ease-out fill-mode-backwards h-full"
              style={{ animationDelay: `${index * 50}ms` }}
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
                onClickSettings={()=>{
                  router.push(`/dashboard/collaborators/${board.id}`)
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}