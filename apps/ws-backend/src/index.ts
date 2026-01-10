import { WebSocketServer,WebSocket } from "ws";
import cookie from "cookie"
import jwt from "jsonwebtoken";
const wss=new WebSocketServer({port:5000});
wss.on("connection",function connection(ws:WebSocket,req){
    try {
        const rawcookie=req.headers.cookie;
        if (!rawcookie) {
            ws.close(1008,"No cookies");
            return;
        }
        const cookies=cookie.parse(rawcookie);
        const token=cookies.token;
        if (!token) {
            ws.close(1008,"No token")
            return;
        }
        const secret=process.env.JWT_SECRET;
        if (!secret) {
            ws.close(1008,"Secret not avalaible")
            return;
        }
        const decoded=jwt.verify(token,secret)
        if (typeof decoded === "string") {
            ws.close(1008,"Payloa in wrong format");
            return;
        }
        if (!decoded ||!decoded.id) {
            ws.close(1008,"Not authorized")
            return;
        }
        ws.userId=decoded.id;
        console.log("WS authenticated:", decoded.id);
    } catch (error) {
        
    }
});
