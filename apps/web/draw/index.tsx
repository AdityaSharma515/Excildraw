import api from "@/lib/api"
import { UUID } from "node:crypto"

type Rectangledata={
  startx:number,
  starty:number,
  width:number,
  height:number
}
type shape={
    type:"Rectangle",
    data:Rectangledata
  }

export async function initdraw(canvas:HTMLCanvasElement,id:string): Promise<() => void>{
    const ctx = canvas.getContext("2d")
    if (!ctx) return  () => {}
    let existingshape:shape[]=await getshape(id);    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    clearcanvas(existingshape,canvas,ctx);
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

    const onMouseUp = (e: MouseEvent) => {
      clicked = false
      const pos = getMousePos(e)
      const width = pos.x - startX
      const height = pos.y - startY
      existingshape.push({type:"Rectangle",data:{
        "startx":startX,
        "starty":startY,
        width,
        height
      }})
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!clicked) return

      const pos = getMousePos(e)
      const width = pos.x - startX
      const height = pos.y - startY

      clearcanvas(existingshape,canvas,ctx);

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

function clearcanvas(existingshape:shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  existingshape.map((shape)=>{
    if(shape.type==="Rectangle"){
      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      ctx.strokeRect(shape.data.startx, shape.data.starty, shape.data.width, shape.data.height)
    }
  })
}

async function getshape(id:string){
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!BASE_URL) throw new Error("Backend URL not found")

    const response=await api.get(`${BASE_URL}/boards/${id}/elements`)
    const data=response.data.elements;
    console.log(data);
    const shape=data.map((ele:shape[])=>{
        return ele;
    })
    return shape;
  } catch (error) {
    console.error("error in fetching elements",error)
  }
}