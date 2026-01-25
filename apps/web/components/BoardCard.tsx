import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Globe, Trash2 } from "lucide-react"
import { Button } from "./ui/button"


type BoardCardProps = {
  id: string
  title: string
  isPublic: boolean
  onDelete: (id: string) => void
}


export function BoardCard({
  id,
  title,
  isPublic,
  onDelete,
}: BoardCardProps) {
  return (
    <Card className="group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="text-lg font-semibold line-clamp-1">
          {title}
        </CardTitle>

        {isPublic ? (
          <Globe className="h-4 w-4 text-green-500" />
        ) : (
          <Lock className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isPublic ? "Public board" : "Private board"}
        </p>

        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation() // 🔥 prevents card click
            onDelete(id)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}