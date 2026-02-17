import { Tool } from "@/components/Toolbar"
import api from "@/lib/api"
import { v4 as uuidv4 } from "uuid";
import { dragMove, startDragging, stopDragging } from "./drag";

type Rectangledata={
  startx:number,
  starty:number,
  width:number,
  height:number
}
type CircleData={
  centerx:number,
  centery:number,
  radius:number
}
type Linedata={
  startx:number,
  starty:number,
  endx:number,
  endy:number
}

export type shape=|{
    id:string,
    type:"Rectangle",
    data:Rectangledata
  }|
  {
    id:string,
    type:"Circle",
    data:CircleData
  }|
  {
    id:string,
    type:"Arrow",
    data:Linedata
  }|
  {
    id:string,
    type:"Line",
    data:Linedata
  }

  function canvas_arrow(ctx:CanvasRenderingContext2D, fromx:number, fromy:number, tox:number, toy:number) {
    const dx = tox - fromx;
    const dy = toy - fromy;
    const headlen =20
    const angle = Math.atan2( dy, dx );
    ctx.beginPath();
    ctx.moveTo( fromx, fromy );
    ctx.lineTo( tox, toy );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo( tox - headlen * Math.cos( angle - Math.PI / 6 ), toy - headlen * Math.sin( angle - Math.PI / 6 ) );
    ctx.lineTo( tox, toy );
    ctx.lineTo( tox - headlen * Math.cos( angle + Math.PI / 6 ), toy - headlen * Math.sin( angle + Math.PI / 6 ) );
    ctx.stroke();
}

function isPointInsideRect(
  x: number,
  y: number,
  rect: Rectangledata
) {
  return (
    x >= rect.startx &&
    x <= rect.startx + rect.width &&
    y >= rect.starty &&
    y <= rect.starty + rect.height
  )
}
function isPointInsideCircle(
  x: number,
  y: number,
  circle: CircleData
) {
  const result=((x-circle.centerx)*(x-circle.centerx))+((y-circle.centery)*(y-circle.centery));
  const d=Math.sqrt(result)
  return (
    d<=circle.radius
  )
}
function checkinside(x:number,y:number,shape:shape){
  if(shape.type==="Rectangle"){
    return isPointInsideRect(x,y,shape.data)
  }
  else if(shape.type==="Circle"){
    return isPointInsideCircle(x,y,shape.data)
  }
  return false
}

export async function initdraw(canvas:HTMLCanvasElement,id:string,socket:WebSocket,toolRef:React.RefObject<Tool>): Promise<() => void>{
    const ctx = canvas.getContext("2d")
    if (!ctx) return  () => {}
    let existingshape: shape[] = (await getshape(id)) ?? []; 
    let selectedid:string|null=null
    let mode: "idle" | "drawing" | "dragging" = "idle"
    socket.onmessage=(event)=>{
      const message=JSON.parse(event.data);
      console.log(message);
      if(message.type=="DRAW"){
        const incoming: shape = message.data.shape
        const idx = existingshape.findIndex(s => s.id === incoming.id)
        if (idx >= 0) {
          // update existing shape in-place
          existingshape[idx] = incoming
        } else {
          // new shape, add it
          existingshape.push(incoming)
        }
        clearcanvas(existingshape,canvas,ctx,selectedid)
      }
    }  
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    clearcanvas(existingshape,canvas,ctx,selectedid);
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
      const pos = getMousePos(e)
      startX = pos.x
      startY = pos.y
      const tool = toolRef.current

      if (tool === "select") {
        const hitshape = [...existingshape]
          .reverse()
          .find(shape => checkinside(startX, startY, shape))

        if (hitshape && hitshape.id) {
          selectedid = hitshape.id
          mode = "dragging"
          startDragging(hitshape, startX, startY) 
          clearcanvas(existingshape, canvas, ctx, selectedid)
        } else {
          selectedid = null
          mode = "idle"
          clearcanvas(existingshape, canvas, ctx, selectedid)
        }
        return
      }

      clicked = true
      mode = "drawing"
    }


    const onMouseUp = (e: MouseEvent) => {
      const tool = toolRef.current
      if (tool === "select" && mode === "dragging") {
        stopDragging()
        mode = "idle"
        Saveshape(id, existingshape)
        return
      }
      if (mode !== "drawing") return
      clicked = false
      mode = "idle"
      const pos = getMousePos(e)
      let shape:shape
      if(tool==="rectangle"){
        const width = pos.x - startX
        const height = pos.y - startY
        shape={id:uuidv4(),type:"Rectangle",data:{
          "startx":startX,
          "starty":startY,
          width,
          height
        }}
      }
      else if(tool==="circle"){
        const dx = pos.x - startX
        const dy = pos.y - startY
        const radius = Math.sqrt(dx * dx + dy * dy)
        shape={id:uuidv4(),type:"Circle",data:{
          "centerx":startX,
          "centery":startY,
          radius
        }}
      }
      else if(tool==="arrow"){
        shape={id:uuidv4(),type:"Arrow",data:{
          "startx":startX,
          "starty":startY,
          endx:pos.x,
          endy:pos.y
        }}
      }
      else{
        shape={id:uuidv4(),type:"Line",data:{
          "startx":startX,
          "starty":startY,
          endx:pos.x,
          endy:pos.y
        }}
      }
      existingshape.push(shape)
      Saveshape(id,existingshape);
      socket.send(JSON.stringify({
        type:"DRAW",
        data:{shape},
        roomId:id
      }))
    }

    const onMouseMove = (e: MouseEvent) => {
      const tool = toolRef.current
      const pos = getMousePos(e)
      if (tool === "select" && mode === "dragging") {
        existingshape = dragMove(existingshape, pos.x, pos.y)
        clearcanvas(existingshape, canvas, ctx,selectedid)
        return
      }
      if (!clicked || mode !== "drawing") return
      clearcanvas(existingshape,canvas,ctx,selectedid);

      ctx.strokeStyle = "white"
      ctx.lineWidth = 2
      
      if (tool==="rectangle") {
        const width = pos.x - startX
        const height = pos.y - startY
        ctx.strokeRect(startX, startY, width, height)
      }
      else if(tool==="circle"){
        const dx = pos.x - startX
        const dy = pos.y - startY
        const radius = Math.sqrt(dx * dx + dy * dy)

        ctx.beginPath()
        ctx.arc(startX, startY, radius, 0, Math.PI * 2)
        ctx.stroke()
      }
      else if(tool==="arrow"){
        ctx.beginPath();
        canvas_arrow(ctx, startX,startY,pos.x,pos.y);
        ctx.stroke();
      }
      else{
        ctx.beginPath();
        ctx.moveTo( startX, startY );
        ctx.lineTo( pos.x, pos.y );
        ctx.stroke();
      }
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

function clearcanvas(existingshape:shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D,selectedid: string | null){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  existingshape.forEach((shape)=>{
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    if(shape.type==="Rectangle"){  
      ctx.strokeRect(shape.data.startx, shape.data.starty, shape.data.width, shape.data.height)
      if (shape.id === selectedid) {
        ctx.save()
        ctx.strokeStyle = "#4f46e5"  // nice blue
        ctx.lineWidth = 2
        ctx.setLineDash([6, 4])
        ctx.strokeRect(
          shape.data.startx - 4,
          shape.data.starty - 4,
          shape.data.width + 8,
          shape.data.height + 8
        )
        ctx.restore()
      }
    }
    else if(shape.type==="Circle"){
      ctx.beginPath();
      ctx.arc(shape.data.centerx, shape.data.centery, shape.data.radius, 0, Math.PI * 2)
      ctx.stroke();
    }
    else if(shape.type==="Arrow"){
      ctx.beginPath();
      canvas_arrow(ctx, shape.data.startx,shape.data.starty,shape.data.endx,shape.data.endy);
      ctx.stroke();
    }
    else{
      ctx.beginPath();
      ctx.moveTo( shape.data.startx,shape.data.starty );
      ctx.lineTo( shape.data.endx,shape.data.endy );
      ctx.stroke();
    }
  })
}

async function getshape(id:string){
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!BASE_URL) throw new Error("Backend URL not found")

    const response=await api.get(`${BASE_URL}/boards/${id}/elements`)
    const elements=response.data.elements;
    const shapes: shape[] = elements.map((el: any) => ({
      id:el.id,
      type: el.type,
      data: el.data    
    }))
    return shapes;
  } catch (error) {
    console.error("error in fetching elements",error)
  }
}
async function Saveshape(id:string,existingshape:shape[]){
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!BASE_URL) throw new Error("Backend URL not found")

    const response=await api.put(`${BASE_URL}/boards/${id}/elements`,{
      elements:existingshape
      })
    console.log(response.data);
  } catch (error) {
    console.error("error in saving elements",error)
  }
}