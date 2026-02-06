"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import api from "@/lib/api"


export default function CreateBoardDialog() {
  const [open, setOpen] = useState<boolean>(false)
  const [loading,Setloading]=useState<boolean>(false)
  const [name, setName] = useState("")
  const [visibility, setVisibility] = useState<boolean>(false)
  const router = useRouter()

  const createBoard = async () => {
    if (!name.trim()) {
      toast.error("Board name is required")
      return
    }

    Setloading(true)
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!BASE_URL) throw new Error("Backend URL not found")
    const response=await api.post(`${BASE_URL}/boards`,{
      title:name,
      isPublic:visibility
    })
    console.log(response.data)
    toast.success("Board created")
    setOpen(false)

    router.refresh()
  }

return (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button>Create Board</Button>
    </DialogTrigger>

    <DialogContent>
      <DialogTitle>Create Board</DialogTitle>

      <Input
        placeholder="Board name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select
        className="w-full rounded-md border p-2"
        value={String(visibility)}
        onChange={(e) => setVisibility(e.target.value === "true")}
      >
        <option value="false">Private</option>
        <option value="true">Public</option>
      </select>

      <Button
        className="w-full"
        onClick={createBoard}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create"}
      </Button>
    </DialogContent>
  </Dialog>
)
}
