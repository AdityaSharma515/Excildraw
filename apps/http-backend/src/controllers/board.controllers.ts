import { prismaClient } from "@repo/db/client";
import {Request,Response, NextFunction } from "express";

export async function createBoard(req:Request,res:Response,next:NextFunction){
    const title=req.body.title as string;
    const isPublic=req.body.isPublic;
    if(!title){
        res.status(400).json({
            message:"Title not found"
        });
        return;
    }
    try {
        if(!req.user || !req.user.id){
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const newboard=await prismaClient.board.create({data:{title:title,ownerId:req.user.id,isPublic:isPublic ?? false}})
        res.status(201).json({
            message:"Board created successfully",
            newboard
        })
    } catch (error) {
        res.status(500).json({
            message:"Error in creating Board"
        })
        console.error(error);
    }
}
export async function getBoard(req:Request,res:Response,next:NextFunction){
    try {
        if (!req.user|| !req.user.id) {
            res.status(401).json({
                message:"Unautorized"
            })
            return;
        }
        const boards=await prismaClient.board.findMany({where:{ownerId:req.user.id}});
        res.status(200).json({
            boards
        })
    } catch (error) {
        res.status(500).json({
            message:"Unable to fetch the board"
        })
        console.error(error);
    }
}
export  async function openBoard(req:Request,res:Response,next:NextFunction){
    if(!req.user || !req.user.id){
        res.status(401).json({
            message:"Unautharized"
        });
        return;
    }
    try {
        const boardid=req.params.id;
        if(!boardid){
            res.status(401).json({
                message:"boardid not found"
            })
            return;
        }
        const accessboard=await prismaClient.board.findFirst({where:{
            id:boardid,
            OR:[
                {ownerId:req.user.id},
                {collaborators:{some:{userid:req.user.id}}}
            ]
        }});
        if (!accessboard) {
           res.status(400).json({
            message:"Board not found or no access"
            });
            return; 
        }
        res.status(201).json({
            title:accessboard.title,
            owner:accessboard.ownerId
        })
    } catch (error) {
        res.status(500).json({
            message:"Board not found"
        })
        console.error(error)
    }
}
export async function deleteBoard(req:Request,res:Response,next:NextFunction){
    if (!req.user || !req.user.id) {
        res.status(401).json({
            message:"Unauthorize"
        });
        return;
    }
    try {
        const boardid=req.params.id;
        if(!boardid){
            res.status(400).json({
                message:"Board id not found"
            });
            return;
        }
        const boardaccess=await prismaClient.board.findFirst({
           where:{
                id:boardid,
                ownerId:req.user.id
           } 
        });
        if (!boardaccess) {
            res.status(403).json({
                message:"You can not delete Board"
            });
            return;
        }
        await prismaClient.board.delete({where:{id:boardid}})
        res.status(200).json({
            message:"Board Deleted Succefully"
        })
    } catch (error) {
        res.status(500).json({
            message:"Error in deleting the Board"
        })
        console.error(error);
    }

}
