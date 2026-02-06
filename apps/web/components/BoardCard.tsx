import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Lock,
  Globe,
  Trash2,
  UserPlus,
  LogIn,
  Settings,
} from "lucide-react"

type BoardCardProps = {
  id: string
  title: string
  isPublic: boolean
  onDelete: () => void
  onCollaborate: () => void
  onJoin: (id: string) => void
}

export function BoardCard({
  id,
  title,
  isPublic,
  onDelete,
  onCollaborate,
  onJoin,
}: BoardCardProps) {
  return (
    <Card
      className="
        group relative overflow-hidden
        cursor-pointer rounded-2xl
        border transition-all duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        hover:border-primary/40
      "
    >
      {/* Header */}
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {title}
          </CardTitle>

          <Badge
            variant={isPublic ? "default" : "secondary"}
            className="gap-1"
          >
            {isPublic ? (
              <>
                <Globe className="h-3 w-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                Private
              </>
            )}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {isPublic
            ? "Anyone with the link can join"
            : "Invite-only private board"}
        </p>
      </CardHeader>

      {/* Action Bar */}
      <CardContent className="flex items-center justify-between gap-2 pt-2">
        {/* Join Room */}
        <Button
          size="sm"
          className="gap-2 shadow-sm hover:shadow-md"
          onClick={(e) => {
            e.stopPropagation()
            onJoin(id)
          }}
        >
          <LogIn className="h-4 w-4" />
          Join
        </Button>

        {/* Secondary actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              onCollaborate()
            }}
          >
            <UserPlus className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-red-500"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      {/* Hover glow */}
      <div className="
        pointer-events-none absolute inset-0
        opacity-0 group-hover:opacity-100
        transition-opacity
        bg-gradient-to-br from-primary/10 via-transparent to-transparent
      " />
    </Card>
  )
}
