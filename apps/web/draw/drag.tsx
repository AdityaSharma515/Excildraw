import type { shape } from '.'

type DragState = {
  id: string
  initialMouseX: number
  initialMouseY: number
  initialShape: shape
} | null

let dragState: DragState = null

export function startDragging(
  s: shape,
  mouseX: number,
  mouseY: number
) {
  if (!s.id) return
  const initialShape: shape = JSON.parse(JSON.stringify(s))
  dragState = {
    id: s.id,
    initialMouseX: mouseX,
    initialMouseY: mouseY,
    initialShape,
  }
}

export function dragMove(
  shapes: shape[],
  mouseX: number,
  mouseY: number
) {
  if (!dragState) return shapes
  const dx = mouseX - dragState.initialMouseX
  const dy = mouseY - dragState.initialMouseY
  return shapes.map(s => (s.id === dragState?.id ? moveShapeFromInitial(dragState.initialShape, dx, dy) : s))
}

export function stopDragging() {
  dragState = null
}

function moveShapeFromInitial(initial: shape, dx: number, dy: number): shape {
  switch (initial.type) {
    case "Rectangle":
      return {
        ...initial,
        data: {
          ...initial.data,
          startx: initial.data.startx + dx,
          starty: initial.data.starty + dy,
        }
      }

    case "Circle":
      return {
        ...initial,
        data: {
          ...initial.data,
          centerx: initial.data.centerx + dx,
          centery: initial.data.centery + dy,
        }
      }

    case "Line":
    case "Arrow":
      return {
        ...initial,
        data: {
          ...initial.data,
          startx: initial.data.startx + dx,
          starty: initial.data.starty + dy,
          endx: initial.data.endx + dx,
          endy: initial.data.endy + dy,
        }
      }

    default:
      return initial
  }
}