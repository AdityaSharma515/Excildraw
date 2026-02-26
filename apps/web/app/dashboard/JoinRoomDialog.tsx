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
import { toast } from "sonner"
import api from "@/lib/api"
import { useRouter } from "next/navigation"

type JoinRoomProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function JoinRoomDialog({
  open,
  onOpenChange,
}: JoinRoomProps) {
  const [loading, setLoading] = useState(false)
  const [Boardid, setBoardid] = useState("")
  const router=useRouter();

  const JoinRoom = async () => {
    if (!Boardid.trim()) {
      toast.error("Room Id is required")
      return
    }

    try {
      setLoading(true)
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!BASE_URL) throw new Error("Backend URL not found")

      await api.get(`${BASE_URL}/boards/${Boardid}/checkaccess`)

      toast.success("Room Joined successfully")
      onOpenChange(false)
      router.push(`/canvas/${Boardid}`)
      setBoardid("")
    } catch (err) {
      toast.error("Failed to join room. Please check the ID and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border rounded-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
            Join Room
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Join Public and Private rooms by entering the Room Id
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="userid" className="text-foreground font-semibold">
              Room ID
            </Label>
            <Input
              id="Boardid"
              placeholder="e.g. 4121d6ee-8cba-4c09-9ed6-572cd4d7e7f9"
              className="bg-background border-border rounded-xl focus-visible:ring-primary h-11 text-foreground"
              value={Boardid}
              onChange={(e) => setBoardid(e.target.value)}
              disabled={loading}
            />
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
            onClick={JoinRoom}
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}