import { NextRequest, NextResponse } from "next/server";

export async function proxy(req:NextRequest){
    const token=req.cookies.get("token")?.value
    if(!token){
        return NextResponse.redirect(new URL("/",req.url))
    }

    try {
        const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: {
            cookie: `token=${token}`,
          },
          cache: "no-store",
        })
        if(!res.ok){
            return NextResponse.redirect(new URL("/",req.url))
        }
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/",req.url))
    }
}

export const config={
    matcher:["/dashboard/:path*","/canvas/:path*"]
}