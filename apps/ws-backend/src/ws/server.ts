import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { WSMessage } from "./message";
import { canJoinRoom } from "./permissions";

const rooms = new Map<string, Set<WebSocket>>();

export function startWSServer(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", async (ws:WebSocket, req) => {
    try {
      const rawCookie = req.headers.cookie;
      if (!rawCookie) {
        ws.close(1008, "No cookies");
        return;
      }
      const token = rawCookie
        .split(";")
        .map(c => c.trim())
        .filter(c => c.startsWith("token="))
        .pop()
        ?.replace("token=", "");

      if (!token) {
        ws.close(1008, "No token");
        return;
      }
      const secret=process.env.JWT_SECRET;
      if(!secret){
        ws.close(1008, "No Secret");
        return;
      }
      const decoded = jwt.verify(token,secret) as {
        id: string;
      };

      ws.userId = decoded.id;
      ws.rooms = new Set();

      console.log("WS authenticated:", ws.userId);

      ws.on("message", async (raw) => {
        let msg: WSMessage;

        try {
          msg = JSON.parse(raw.toString());
        } catch {
          return;
        }

        switch (msg.type) {
          case "JOIN_ROOM": {
            if (!(await canJoinRoom(ws.userId!, msg.roomId))) {
              ws.send(JSON.stringify({ type: "ERROR", message: "Forbidden" }));
              return;
            }

            if (!rooms.has(msg.roomId)) {
              rooms.set(msg.roomId, new Set());
            }

            rooms.get(msg.roomId)!.add(ws);
            ws.rooms!.add(msg.roomId);

            console.log(`➕ ${ws.userId} joined ${msg.roomId}`);
            break;
          }

          case "LEAVE_ROOM": {
            leaveRoom(ws, msg.roomId);
            break;
          }

          case "DRAW": {
            if (!ws.rooms!.has(msg.roomId)) return;
            const parsedData =
              typeof msg.data === "string"
                ? JSON.parse(msg.data)
                : msg.data;
            broadcast(msg.roomId, ws, {
              type: "DRAW",
              data: parsedData,
              userId: ws.userId
            });
            break;
          }
        }
      });

      ws.on("close", () => {
        for (const roomId of ws.rooms!) {
          leaveRoom(ws, roomId);
        }
        console.log("❌ WS disconnected:", ws.userId);
      });

    } catch(err) {
      console.error("WS AUTH ERROR:", err);
      ws.close(1008, "Invalid token");
    }
  });

  console.log(`🚀 WS server running on ws://localhost:${port}`);
}


function leaveRoom(ws: WebSocket, roomId: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.delete(ws);
  ws.rooms!.delete(roomId);

  if (room.size === 0) {
    rooms.delete(roomId);
  }

  console.log(`➖ ${ws.userId} left ${roomId}`);
}

function broadcast(roomId: string, sender: WebSocket, payload: any) {
  const room = rooms.get(roomId);
  if (!room) return;

  for (const client of room) {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  }
}
