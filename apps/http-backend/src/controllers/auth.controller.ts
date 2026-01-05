import { Request,Response } from "express";
import {z} from "zod";
import bcrypt from "bcrypt"
import { prismaClient } from "@repo/db/client";
export async function signup(req:Request,res:Response){
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