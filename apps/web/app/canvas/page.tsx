"use client"
import { initdraw } from "@/draw"
import { useEffect, useRef } from "react"

function Boards() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const cleanup = initdraw(canvas)

    return () => {
      cleanup?.()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen bg-black"
    />
  )
}

export default Boards
