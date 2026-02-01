import { initdraw } from '@/draw'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { Tool, Toolbar } from './Toolbar'

const Canvas = ({id,socket}:{id:string,socket:WebSocket}) => {
    const [tool, setTool] = useState<Tool>("line")
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect( () => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cleanup: (() => void) | undefined

    const setup = async () => {
        cleanup = await initdraw(canvas, id,socket,tool)
    }

    setup()
    return () => {
      if (typeof cleanup === "function") {
            cleanup()
        }
    }
  }, [canvasRef])
  return (
    <div className="relative h-screen w-screen bg-[#121212] overflow-hidden">

    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
      <Toolbar tool={tool} setTool={setTool} />
    </div>

    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10"
    />
  </div>

  )
}

export default Canvas