"use client"

import { useEffect, useState } from "react"
import CreateBoardDialog from "./CreateBoardDialog"
import api from "@/lib/api"
import { BoardCard } from "@/components/BoardCard"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { UUID } from "crypto"


type Board = {
  id: string
  title: string
  isPublic: boolean
}

export default function DashboardPage() {
  const [boards, setBoards] = useState<Board[]>([])
  const [loading, setLoading] = useState(false)
  const router=useRouter();
  useEffect(() => {
    async function getBoards() {
      try {
        setLoading(true)
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        const response = await api.get(`${BASE_URL}/boards`)
        setBoards(response.data.boards)
      } finally {
        setLoading(false)
      }
    }
    getBoards()
  }, [])
  async function deleteboard(id:string){
    if (!confirm("Are you sure you want to delete this board?")) return

      try {
          const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
          if (!BASE_URL) throw new Error("Backend URL not found")
          // simulate API call
          const response=await api.delete(`${BASE_URL}/boards/${id}`)
          console.log(response.data)
          router.refresh();
          toast.success("Board deleted")
      } catch (error) {
          console.error("error in deleting board",error);
          toast.error("Unable to delete")
      }

  }   
  

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your boards and collaborate
          </p>
        </div>
        <CreateBoardDialog />
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : boards.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
          <p className="text-lg font-medium">No boards yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first board to get started 🚀
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <BoardCard
            key={board.id}
            id={board.id}
            title={board.title}
            isPublic={board.isPublic}
            onDelete={()=>deleteboard(board.id)}
  />
          ))}
        </div>
      )}
    </div>
  )
}
