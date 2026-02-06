"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import api from "@/lib/api"

type AddCollaboratorProps = {
  boardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddCollaborator({
  boardId,
  open,
  onOpenChange,
}: AddCollaboratorProps) {
  const [loading, setLoading] = useState(false)
  const [userid, setUserid] = useState("")
  const [role, setRole] = useState<"viewer" | "editor">("viewer")

  const addCollaborator = async () => {
    if (!userid.trim()) {
      toast.error("User ID is required")
      return
    }

    try {
      setLoading(true)
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

      await api.post(
        `${BASE_URL}/users/boards/${boardId}/collaborators`,
        {
          userid,
          role,
        }
      )

      toast.success("Collaborator added")
      onOpenChange(false)
      setUserid("")
      setRole("viewer")
    } catch (err) {
      toast.error("Failed to add collaborator")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Collaborator</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="User ID or Email"
          value={userid}
          onChange={(e) => setUserid(e.target.value)}
        />

        <select
          className="w-full rounded-md border p-2"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "viewer" | "editor")
          }
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>

        <Button
          className="w-full"
          onClick={addCollaborator}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
