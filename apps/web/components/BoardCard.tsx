"use client"

import { useState } from "react"
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
  Copy,
  Check,
} from "lucide-react"

type BoardCardProps = {
  id: string
  title: string
  isPublic: boolean
  onDelete: () => void
  onCollaborate: () => void
  onJoin: (id: string) => void
  onClickSettings: () => void
}

export function BoardCard({
  id,
  title,
  isPublic,
  onDelete,
  onCollaborate,
  onJoin,
  onClickSettings,
}: BoardCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text:string) => {
    navigator.clipboard.writeText(text);
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Card
      onClick={() => onJoin(id)}
      className="
        group relative overflow-hidden cursor-pointer
        rounded-2xl border bg-card
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
      "
    >
      {/* Gradient Accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* HEADER */}
      <CardHeader className="space-y-3 pb-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold leading-tight line-clamp-1">
            {title}
          </CardTitle>

          <Badge
            variant={isPublic ? "default" : "secondary"}
            className="gap-1 rounded-full px-2.5 py-0.5"
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

        {/* ID + COPY */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground font-mono truncate">
            {id}
          </p>

          <Button
            size="icon"
            variant="ghost"
            className="
              h-8 w-8 rounded-lg
              text-muted-foreground
              hover:text-primary hover:bg-primary/10
              opacity-0 group-hover:opacity-100
              transition-all
            "
            onClick={(e)=>{
              e.stopPropagation();
              handleCopy(id)
            }}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {isPublic
            ? "Anyone with the link can join"
            : "Invite-only private board"}
        </p>
      </CardHeader>

      {/* ACTION BAR */}
      <CardContent className="flex items-center justify-between pt-3">
        {/* JOIN BUTTON */}
        <Button
          size="sm"
          className="
            gap-2 rounded-xl
            bg-gradient-to-r from-violet-600 to-indigo-600
            hover:from-violet-700 hover:to-indigo-700
            text-white shadow-md
          "
          onClick={(e) => {
            e.stopPropagation()
            onJoin(id)
          }}
        >
          <LogIn className="h-4 w-4" />
          Join
        </Button>

        {/* SECONDARY ACTIONS */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="icon"
            className="rounded-lg"
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
            className="rounded-lg"
            onClick={(e) => {
              e.stopPropagation()
              onClickSettings()
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg text-red-500 hover:bg-red-500/10"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      {/* Hover Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/5" />
    </Card>
  )
}