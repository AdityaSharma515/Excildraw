import {Request,Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export function auth(req:Request,res:Response,next:NextFunction){
    const token=req.cookies.token;
    if (!token) {
        res.status(401).json({
            message:"Unauthorized"
        });
        return;
    }
    try {
        const secret=process.env.JWT_SECRET;
        if(!secret){
            res.status(500).json({
                message:"Internal server error"
            })
            return;
        }
        const decoded=jwt.verify(token,secret);
        if (typeof decoded === "string") {
            res.status(500).json({message:"Invalid token"});
            return;
        }
        req.user={
            id:decoded.id as string
        }
        next()
    } catch (error) {
        res.status(500).json({message:"internal server error"});
        console.error(error);
    }
}