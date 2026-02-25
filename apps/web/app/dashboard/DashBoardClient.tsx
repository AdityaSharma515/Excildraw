"use client"

import { useState } from "react"
import { Search, LayoutGrid } from "lucide-react"
import CreateBoardDialog from "./CreateBoardDialog"
import api from "@/lib/api"
import { BoardCard } from "@/components/BoardCard"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import AddCollaborator from "./AddCollaborator"

export type Board = {
  id: string
  title: string
  isPublic: boolean
  createdAt?: string 
}

type Props = {
  boards?: Board[]
}

const DashBoardClient = ({ boards: InitialBoard = [] }: Props) => {
  const [boards, setBoards] = useState<Board[]>(InitialBoard)
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)
  const [collabOpen, setCollabOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  async function deleteboard(id: string) {
    if (!confirm("Are you sure you want to delete this board?")) return

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!BASE_URL) throw new Error("Backend URL not found")
      
      setBoards(prev => prev.filter(b => b.id !== id))
      
      await api.delete(`${BASE_URL}/boards/${id}`)
      toast.success("Board deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Unable to delete board")
    }
  }

  function addboard(board: Board) {
    setBoards(prev => [...prev, board])
  }

  const filteredBoards = boards.filter(board => 
    board.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 md:p-10 pb-20 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header & Controls Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-1.5">
          {/* Updated text-slate-900 to text-foreground */}
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
          {/* Updated text-slate-500 to text-muted-foreground */}
          <p className="text-muted-foreground font-medium text-base">
            Manage your projects and collaborate with your team.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            {/* Updated text-slate-400 to text-muted-foreground */}
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {/* Updated bg-white, border-slate-200, text-slate-700 to semantic classes */}
            <Input
              placeholder="Search boards..."
              className="pl-10 h-11 bg-background border-border rounded-xl shadow-sm focus-visible:ring-primary text-foreground font-medium transition-all w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <CreateBoardDialog Oncreate={addboard}/>
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
      {filteredBoards.length === 0 ? (
        // Updated empty state background and borders to use semantic classes
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/50 py-28 text-center mt-8">
          {/* Updated random violets to use primary color dynamically */}
          <div className="rounded-2xl bg-primary/10 p-5 mb-5 shadow-sm border border-primary/20">
            {searchQuery ? <Search className="h-10 w-10 text-primary" /> : <LayoutGrid className="h-10 w-10 text-primary" />}
          </div>
          <h3 className="text-xl font-bold text-foreground">
            {searchQuery ? "No matching boards found" : "No boards created yet"}
          </h3>
          <p className="mt-2 text-base text-muted-foreground max-w-sm mx-auto mb-8 font-medium">
            {searchQuery 
              ? "Try adjusting your search terms to find what you're looking for." 
              : "Create your first board to start visualizing your workflow."}
          </p>
          {!searchQuery && <CreateBoardDialog Oncreate={addboard}/>}
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
                onClickSettings={() => {
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

export default DashBoardClient