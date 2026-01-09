import { prismaClient,Role } from "@repo/db/client";
import {Request,Response, NextFunction } from "express";

export async function addCollaborator(req:Request,res:Response,next:NextFunction){
    if (!req.user|| !req.user.id) {
        res.status(401).json({
            message:"Unauthorized"
        });
        return;
    }
    try {
        const userid:string=req.body.userid;
        if (!userid) {
            res.status(400).json({
                message:"Userid not present"
            });
            return;
        }
        const role:Role=req.body.role;
        if (!role) {
            res.status(400).json({
                message:"Role is not defiend"
            })
            return;
        };
        const boardid=req.params.id;
        if (!boardid) {
            res.status(400).json({
                message:"Board id not present"
            })
            return;
        };
        const checkOwner=await prismaClient.board.findFirst({where:{ownerId:req.user.id,id:boardid}});
        if (!checkOwner) {
            res.status(403).json({
                message:"You have not the access"
            })
            return;
        }
        const Isaleradyexist=await prismaClient.boardCollaborator.findUnique({
            where:{
                boardId_userid:{
                    boardId:boardid,
                    userid
                }}});
        if (Isaleradyexist) {
            res.status(409).json({
                message:"User already exist"
            })
            return;
        }
        await prismaClient.boardCollaborator.create({data:{userid:userid,boardId:boardid,role:role}})
        res.status(201).json({
            message:"Collaborator added succefully"
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal servor error"
        })
        console.error(error);
    }
}
export async function getCollaborator(req:Request,res:Response,next:NextFunction){
    if (!req.user|| !req.user.id) {
        res.status(401).json({
            message:"Unauthorized"
        });
        return;
    }
    try {
        const boardid=req.params.id;
        if (!boardid) {
            res.status(400).json({
                message:"Board id not present"
            })
            return;
        };
        const board= await prismaClient.board.findFirst({where:{
            id:boardid,
            OR:[
                {ownerId:req.user.id},
                {collaborators:{
                    some:{userid:req.user.id,role:{in:["viewer","editor"]}
                }}}
            ]
        }}) 
        if (!board) {
            res.status(403).json({
                message:"You do not have access to view collaborators"
            })
            return;
        }
        const allCollaborators=await prismaClient.boardCollaborator.findMany({where:{boardId:boardid},select:{userid:true,role:true}});
        res.status(200).json({
            message:"Fetched all collaborator successfully",
            allCollaborators,
        })
    } catch (error) {
        res.status(500).json({
            message:"Internal servor error"
        })
        console.error(error);
    }
}
export async function deleteCollaborator(req:Request,res:Response,next:NextFunction) {
     if (!req.user|| !req.user.id) {
        res.status(401).json({
            message:"Unauthorized"
        });
        return;
    }
    try {
        const boardid=req.params.id;
        const userId=req.params.userId;
        if (!boardid) {
            res.status(400).json({
                message:"Board id not present"
            })
            return;
        };
        if (!userId) {
            res.status(400).json({
                message:"User Id id not present"
            })
            return;
        };
        const checkOwner=await prismaClient.board.findFirst({where:{ownerId:req.user.id,id:boardid}});
        if (!checkOwner) {
            res.status(403).json({
                message:"You are not the owner"
            })
            return;
        }
        const collaboratorexist=await prismaClient.boardCollaborator.findUnique(
            {where:
                {boardId_userid:{
                    boardId:boardid,
                    userid:userId
                }}});
        if (!collaboratorexist) {
            res.status(404).json({
                message:"Collaborator not found"
            })
            return;
        }
        await prismaClient.boardCollaborator.delete({where:{boardId_userid:{
            boardId:boardid,
            userid:userId
        }}})
        res.status(200).json({
            message:"Collaborator deleted succesfully"
        })
    } catch (error) {
       res.status(500).json({
            message:"Internal servor error"
        })
        console.error(error);
    }
}