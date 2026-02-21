import * as express from "express";
import { User as PrismaUser } from "@prisma/client";
declare global{
    namespace Express{
        interface Request{
            user?:{
                id:string;
            };
        }
    }
}
declare global {
  namespace Express {
    interface User {
      id: PrismaUser["id"];
      email?: PrismaUser["email"];
      name?: PrismaUser["name"];
    }
  }
}

export {};