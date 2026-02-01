import { Tool } from "@/components/Toolbar"
import api from "@/lib/api"

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

type shape=|{
    type:"Rectangle",
    data:Rectangledata
  }|
  {
    type:"Circle",
    data:CircleData
  }|
  {
    type:"Arrow",
    data:Linedata
  }|
  {
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

export async function initdraw(canvas:HTMLCanvasElement,id:string,socket:WebSocket,tool:Tool): Promise<() => void>{
    const ctx = canvas.getContext("2d")
    if (!ctx) return  () => {}
    let existingshape: shape[] = (await getshape(id)) ?? []; 
    socket.onmessage=(event)=>{
      const message=JSON.parse(event.data);
      console.log(message);
      if(message.type=="DRAW"){
        existingshape.push(message.data.shape)
        clearcanvas(existingshape,canvas,ctx)
      }
    }  
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
      let shape:shape
      if(tool==="rectangle"){
        const width = pos.x - startX
        const height = pos.y - startY
        shape={type:"Rectangle",data:{
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
        shape={type:"Circle",data:{
          "centerx":startX,
          "centery":startY,
          radius
        }}
      }
      else if(tool==="arrow"){
        shape={type:"Arrow",data:{
          "startx":startX,
          "starty":startY,
          endx:pos.x,
          endy:pos.y
        }}
      }
      else{
        shape={type:"Line",data:{
          "startx":startX,
          "starty":startY,
          endx:pos.x,
          endy:pos.y
        }}
      }
      Saveshape(id,shape);
      existingshape.push(shape)
      socket.send(JSON.stringify({
        type:"DRAW",
        data:{shape},
        roomId:id
      }))
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!clicked) return
      clearcanvas(existingshape,canvas,ctx);

        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
      const pos = getMousePos(e)
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

function clearcanvas(existingshape:shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  existingshape.map((shape)=>{
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    if(shape.type==="Rectangle"){  
      ctx.strokeRect(shape.data.startx, shape.data.starty, shape.data.width, shape.data.height)
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
      type: el.type,
      data: el.data    
    }))
    return shapes;
  } catch (error) {
    console.error("error in fetching elements",error)
  }
}
async function Saveshape(id:string,newshape:shape){
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!BASE_URL) throw new Error("Backend URL not found")

    const response=await api.put(`${BASE_URL}/boards/${id}/elements`,{elements: [
        {
          type: newshape.type,
          data: newshape.data
        }
        ]})
    console.log(response.data);
  } catch (error) {
    console.error("error in saving elements",error)
  }
}