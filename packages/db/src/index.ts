import { PrismaClient,Prisma,Role } from "@prisma/client";

// Prisma 7 requires a non-empty options object in some runtime builds; pass an empty options object to satisfy the runtime check.
export const prismaClient = new PrismaClient({})

export { Prisma,Role }
