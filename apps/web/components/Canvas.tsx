import { initdraw } from '@/draw'
import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { Tool, Toolbar } from './Toolbar'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Canvas = ({id,socket}:{id:string,socket:WebSocket}) => {
    const [tool, setTool] = useState<Tool>("rectangle")
    const toolRef = useRef<Tool>(tool)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const router=useRouter()
    function handleLeaveRoom(){
      socket.send(JSON.stringify({
          type:"LEAVE_ROOM",
          roomId:id
      }))
      router.push("/dashboard")
    }
    useEffect(() => {
      toolRef.current = tool
    }, [tool])
    useEffect( () => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cleanup: (() => void) | undefined
    const setup = async () => {
        cleanup = await initdraw(canvas, id,socket,toolRef)
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
    <Button onClick={handleLeaveRoom} className="absolute top-4 right-4 z-30 bg-neutral-900/80 backdrop-blur-md border border-neutral-700 hover:bg-red-500/10 hover:border-red-500/50 text-neutral-300 hover:text-red-400 rounded-xl px-4 h-10 transition-all duration-200">
      <LogOut className="mr-2 h-4 w-4" />
      Leave Room
    </Button>
  </div>

  )
}

export default Canvas