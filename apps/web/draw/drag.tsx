
import { shape } from "."


type DragState = {
  id: string
  offsetX: number
  offsetY: number
} | null

let dragState: DragState = null

export function startDragging(
  shape: shape,
  mouseX: number,
  mouseY: number
) {
  if (shape.type !== "Rectangle") return

  dragState = {
    id: shape.id!,
    offsetX: mouseX - shape.data.startx,
    offsetY: mouseY - shape.data.starty,
  }
}

export function dragMove(
  shapes: shape[],
  mouseX: number,
  mouseY: number
) {
  if (!dragState) return shapes

  return shapes.map(s => {
    if (s.id === dragState!.id && s.type === "Rectangle") {
      return {
        ...s,
        data: {
          ...s.data,
          startx: mouseX - dragState!.offsetX,
          starty: mouseY - dragState!.offsetY,
        },
      }
    }
    return s
  })
}

export function stopDragging() {
  dragState = null
}
