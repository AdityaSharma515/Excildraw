"use client"

import { Button } from "@/components/ui/button"
import {
  MousePointer2,
  Hand,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Pencil,
  Type,
} from "lucide-react"

export type Tool =
  | "select"
  | "hand"
  | "rectangle"
  | "circle"
  | "line"
  | "arrow"
  | "pencil"
  | "text"

interface ToolbarProps {
  tool: Tool
  setTool: (tool: Tool) => void
}

export function Toolbar({ tool, setTool }: ToolbarProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex gap-1 rounded-xl bg-zinc-900/80 px-3 py-2 backdrop-blur shadow-lg">
        <ToolBtn icon={<MousePointer2 size={18} />} active={tool === "select"} onClick={() => setTool("select")} />
        <ToolBtn icon={<Hand size={18} />} active={tool === "hand"} onClick={() => setTool("hand")} />
        <Divider />
        <ToolBtn icon={<Square size={18} />} active={tool === "rectangle"} onClick={() => setTool("rectangle")} />
        <ToolBtn icon={<Circle size={18} />} active={tool === "circle"} onClick={() => setTool("circle")} />
        <ToolBtn icon={<Minus size={18} />} active={tool === "line"} onClick={() => setTool("line")} />
        <ToolBtn icon={<ArrowRight size={18} />} active={tool === "arrow"} onClick={() => setTool("arrow")} />
        <ToolBtn icon={<Pencil size={18} />} active={tool === "pencil"} onClick={() => setTool("pencil")} />
        <ToolBtn icon={<Type size={18} />} active={tool === "text"} onClick={() => setTool("text")} />
      </div>
    </div>
  )
}

function ToolBtn({
  icon,
  active,
  onClick,
}: {
  icon: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={onClick}
      className={`rounded-lg ${
        active
          ? "bg-white text-black"
          : "text-zinc-300 hover:text-white"
      }`}
    >
      {icon}
    </Button>
  )
}

function Divider() {
  return <div className="mx-1 w-px bg-zinc-700" />
}
