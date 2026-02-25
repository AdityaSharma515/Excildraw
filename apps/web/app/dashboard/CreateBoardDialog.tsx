"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle, 
  DialogDescription,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import api from "@/lib/api"
import { Board } from "./DashBoardClient"
import { Globe, Lock } from "lucide-react"

type Prop = {
  Oncreate: (board: Board) => void
}

export default function CreateBoardDialog({ Oncreate }: Prop) {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, Setloading] = useState<boolean>(false)
  const [name, setName] = useState("")
  const [visibility, setVisibility] = useState<boolean>(false)
  const router = useRouter()

  const createBoard = async () => {
    if (!name.trim()) {
      toast.error("Board name is required")
      return
    }

    try {
      Setloading(true)
      const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!BASE_URL) throw new Error("Backend URL not found")
      
      const response = await api.post(`${BASE_URL}/boards`, {
        title: name,
        isPublic: visibility
      })
      
      Oncreate(response.data.newboard)
      toast.success("Board created successfully")
      
      // Reset form and close
      setName("")
      setVisibility(false)
      setOpen(false)
      router.refresh()
      
    } catch (error) {
      console.error(error)
      toast.error("Failed to create board. Please try again.")
    } finally {
      Setloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Uses our global primary color automatically! */}
        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-md font-semibold px-6 transition-all">
          Create Board
        </Button>
      </DialogTrigger>

      {/* Added sm:max-w-md to keep the modal from getting too wide on desktop */}
      <DialogContent className="sm:max-w-md bg-card border-border rounded-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground tracking-tight">
            Create a new board
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Give your board a name and choose who can access it. 
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-semibold">
              Board Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Marketing Campaign Q3"
              className="bg-background border-border rounded-xl focus-visible:ring-primary h-11 text-foreground"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground font-semibold">
              Visibility
            </Label>
            {/* Replaced native <select> with Shadcn <Select> */}
            <Select 
              disabled={loading} 
              value={visibility ? "public" : "private"} 
              onValueChange={(val) => setVisibility(val === "public")}
            >
              <SelectTrigger className="bg-background border-border rounded-xl h-11 focus:ring-primary text-foreground">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-popover text-popover-foreground">
                <SelectItem value="private" className="focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg my-1">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span>Private (Invite-only)</span>
                  </div>
                </SelectItem>
                <SelectItem value="public" className="focus:bg-accent focus:text-accent-foreground cursor-pointer rounded-lg my-1">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>Public (Anyone can access)</span>
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
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          {/* Uses semantic primary colors instead of hardcoded violet */}
          <Button
            className="bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-600 dark:hover:bg-violet-500 rounded-xl shadow-md font-semibold px-6 transition-all"
            onClick={createBoard}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Board"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}