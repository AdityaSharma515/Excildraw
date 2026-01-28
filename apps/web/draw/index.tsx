export function initdraw(canvas:HTMLCanvasElement){
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let clicked = false
    let startX = 0
    let startY = 0

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      clicked = true
      const pos = getMousePos(e)
      startX = pos.x
      startY = pos.y
    }

    const onMouseUp = () => {
      clicked = false
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!clicked) return

      const pos = getMousePos(e)
      const width = pos.x - startX
      const height = pos.y - startY

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.strokeRect(startX, startY, width, height)
    }

    canvas.addEventListener("mousedown", onMouseDown)
    canvas.addEventListener("mouseup", onMouseUp)
    canvas.addEventListener("mousemove", onMouseMove)
     return () => {
    canvas.removeEventListener("mousedown", onMouseDown)
    canvas.removeEventListener("mouseup", onMouseUp)
    canvas.removeEventListener("mousemove", onMouseMove)
  }
}