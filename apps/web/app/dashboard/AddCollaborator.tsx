"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import api from "@/lib/api"
import { Eye, Pencil } from "lucide-react"

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
      toast.error("User ID or Email is required")
      return
    }

    try {
      setLoading(true)
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!BASE_URL) throw new Error("Backend URL not found")

      await api.post(
        `${BASE_URL}/users/boards/${boardId}/collaborators`,
        {
          userid,
          role,
        }
      )

      toast.success("Collaborator added successfully")
      onOpenChange(false)
      setUserid("")
      setRole("viewer")
    } catch (err) {
      toast.error("Failed to add collaborator. Please check the ID and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border rounded-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
            Share Board
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Invite team members to collaborate on this board by entering their User ID.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="userid" className="text-foreground font-semibold">
              User ID
            </Label>
            <Input
              id="userid"
              placeholder="e.g. 4121d6ee-8cba-4c09-9ed6-572cd4d7e7f9"
              className="bg-background border-border rounded-xl focus-visible:ring-primary h-11 text-foreground"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-semibold">
              Permissions
            </Label>
            {/* Replaced native <select> with theme-aware Shadcn <Select> */}
            <Select
              disabled={loading}
              value={role}
              onValueChange={(val) => setRole(val as "viewer" | "editor")}
            >
              <SelectTrigger className="bg-background border-border rounded-xl h-11 focus:ring-primary text-foreground">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-popover text-popover-foreground">
                <SelectItem value="viewer" className="focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg my-1">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>Viewer (Can only view)</span>
                  </div>
                </SelectItem>
                <SelectItem value="editor" className="focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg my-1">
                  <div className="flex items-center gap-2">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                    <span>Editor (Can draw and edit)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-border mt-2">
          <Button
            variant="ghost"
            className="rounded-xl text-muted-foreground hover:text-foreground"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          {/* Swapped hardcoded violet for semantic primary variables */}
          <Button
            className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-600 dark:hover:bg-violet-500 rounded-xl shadow-md font-semibold px-6 transition-all"
            onClick={addCollaborator}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Collaborator"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}