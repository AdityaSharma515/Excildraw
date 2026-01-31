import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Tool =
  | "cursor"
  | "rectangle"
  | "circle"
  | "line"
  | "arrow"
  | "pencil"
  | "text"
  | "eraser"

const TOOL_GROUPS: { id: Tool; label: string }[][] = [
  [
    { id: "cursor", label: "🖱" },
  ],
  [
    { id: "rectangle", label: "▭" },
    { id: "circle", label: "◯" },
    { id: "line", label: "／" },
    { id: "arrow", label: "➜" },
    { id: "pencil", label: "✎" },
  ],
  [
    { id: "text", label: "A" },
    { id: "eraser", label: "⌫" },
  ],
]

export function Toolbar({
  tool,
  setTool,
}: {
  tool: Tool
  setTool: (t: Tool) => void
}) {
  return (
    <div className="pointer-events-auto">
      <div
        className="
          flex items-center gap-3
          rounded-2xl px-4 py-3
          bg-black/60 backdrop-blur-lg
          border border-white/10
          shadow-xl
        "
      >
        {TOOL_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="flex items-center gap-2">
            {group.map(t => (
              <Button
                key={t.id}
                size="icon"
                onClick={() => setTool(t.id)}
                className={cn(
                  "h-10 w-10 rounded-xl",
                  "text-white/70 hover:text-white",
                  "hover:bg-white/10",
                  "transition-all duration-150",
                  tool === t.id &&
                    "bg-white/20 text-white ring-1 ring-white/30"
                )}
              >
                {t.label}
              </Button>
            ))}

            {/* Divider between groups */}
            {groupIndex < TOOL_GROUPS.length - 1 && (
              <div className="mx-2 h-6 w-px bg-white/15" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
