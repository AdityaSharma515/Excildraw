"use client"
import { useState } from 'react'
import { useEffect } from 'react'
import Canvas from './Canvas';



const RoomCanvas = ({id}:{id:string}) => {
    
    const[Socket,SetSocket]=useState<WebSocket|null>(null);
    const WB_URL=process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    if(!WB_URL){
        return;
    }
    useEffect(()=>{
        const ws= new WebSocket(WB_URL)
        ws.onopen=()=>{
            SetSocket(ws);
            ws.send(JSON.stringify({
                type:"JOIN_ROOM",
                roomId:id
            }))
        }
    },[])
  
  if(!Socket){
    return <div>
        Connecting to server
    </div>
  }
  return <div>
      <Canvas id={id} socket={Socket}/>
    </div>
}

export default RoomCanvas