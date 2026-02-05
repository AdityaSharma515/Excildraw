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
} from "lucide-react"

type BoardCardProps = {
  id: string
  title: string
  isPublic: boolean
  onDelete: (id: string) => void
  onCollaborate?: (id: string) => void
}

export function BoardCard({
  id,
  title,
  isPublic,
  onDelete,
  onCollaborate,
}: BoardCardProps) {
  return (
    <Card
      className="
        group cursor-pointer
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
        rounded-2xl
      "
    >

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {title}
          </CardTitle>

          <Badge
            variant={isPublic ? "default" : "secondary"}
            className="flex items-center gap-1"
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
            ? "Anyone with the link can collaborate"
            : "Only invited members can access"}
        </p>
      </CardHeader>

      <CardContent className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          className="
            gap-2
            opacity-0
            group-hover:opacity-100
            transition-opacity
          "
          onClick={(e) => {
            e.stopPropagation()
            onCollaborate?.(id)
          }}
        >
          <UserPlus className="h-4 w-4" />
          Collaborate
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="
            text-red-500
            opacity-0
            group-hover:opacity-100
            transition-opacity
          "
          onClick={(e) => {
            e.stopPropagation()
            onDelete(id)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
