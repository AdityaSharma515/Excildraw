import { initdraw } from '@/draw'
import { useRef } from 'react'
import { useEffect } from 'react'

const Canvas = ({id,socket}:{id:string,socket:WebSocket}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect( () => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cleanup: (() => void) | undefined

    const setup = async () => {
        cleanup = await initdraw(canvas, id,socket)
    }

    setup()
    return () => {
      if (typeof cleanup === "function") {
            cleanup()
        }
    }
  }, [canvasRef])
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen bg-[#121212]"
    />
  )
}

export default Canvas