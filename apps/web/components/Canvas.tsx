import { initdraw } from '@/draw'
import { useRef } from 'react'
import { useEffect } from 'react'

const Canvas = ({id}:{id:string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect( () => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cleanup: (() => void) | undefined

    const setup = async () => {
        cleanup = await initdraw(canvas, id)
    }

    setup()
    return () => {
      if (typeof cleanup === "function") {
            cleanup()
        }
    }
  }, [])
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen bg-[#121212]"
    />
  )
}

export default Canvas