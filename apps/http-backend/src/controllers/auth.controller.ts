import { NextFunction, Request,Response } from "express";
import {z} from "zod";
import bcrypt from "bcrypt"
import { prismaClient } from "@repo/db/client";
import jwt from "jsonwebtoken";

export async function signup(req:Request,res:Response,next:NextFunction){
    try {
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const user=z.object({
            name:z.string().min(3,"Name should have at least 3 characters").max(15,"Name must have at most 15 character"),
            email:z.string().email("Invalid email"),
            password:z.string().min(6,"password should have at least 6 characters").max(15,"password must have at most 15 character").regex(/[A-Z]/,"password must have at least one uppercase character").regex(/[0-9]/,"password must have at least one number").regex(/[^A-Za-z0-9]/,"password must have at least one special character")
        })
        const result=user.safeParse({name:name,password:password,email:email})
        if (!result.success) {
            res.status(400).json({
                message:result.error
            });
            return;
        }
        const{name:validatedname,password:validatedpass,email:validatedemail}=result.data;
        const existinguser=await prismaClient.user.findFirst({where: {email:validatedemail}})
        if (existinguser) {
            res.status(409).json({
                message:"User already exist"
            });
            return;
        }
        const hashedpass=await bcrypt.hash(validatedpass,10);
        const createdUser=await prismaClient.user.create({data:{
            name:validatedname,email:validatedemail,password:hashedpass
        }})
        if(!createdUser){
            res.status(409).json({
                message:"Error in creating user"
            })
        }
        else{
            res.status(200).json({
                message:"User created succefully"
            })
        }
    } catch (error) {
        res.status(400).json({
            message:"Internal server error"
        });
        console.error(error);
    }
}
export async function signin(req:Request,res:Response,next:NextFunction){
    try {
        const email=req.body.email;
        const password=req.body.password;
        if(!email){
            res.status(400).json({
                message:"Email field is empty"
            });
            return;
        }
        if (!password) {
            res.status(400).json({
                message:"password field is empty"
            });
            return;
        }
        const NewUser=await prismaClient.user.findFirst({where:{email:email}});
        if (!NewUser) {
            res.status(400).json({
                message:"User not found!"
            });
            return;
        }
        const match=await bcrypt.compare(password,NewUser.password)
        if (!match) {
            res.status(401).json({
                message:"Password is not found"
            });
            return;
        }
        const secret=process.env.JWT_SECRET;
        if(!secret){
            res.status(500).json({
                message:"Server configuration error"
            });
            return;
        }
        const token=jwt.sign({id:NewUser.id},secret,{expiresIn:"1h"})
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"lax",
            maxAge:60*60*1000
        });
        res.status(200).json({
            message:"signin Succesfully",
        });

    } catch (error) {
        res.status(500).json({
            message:"Internal servor error"
        }
        );
        console.error(error);
    }
}
export async function information(req:Request,res:Response,next:NextFunction){
    try {
        const currentuser=await prismaClient.user.findFirst({where:{id:req.user?.id}});
        if(!currentuser){
            res.status(400).json({
                message:"user not found"
            });
            return;
        }
        res.status(200).json({
            currentuser
        });
    } catch (error) {
        res.status(500).json({
            message:"Internal server error"
        });
        console.error(error);
    }

}