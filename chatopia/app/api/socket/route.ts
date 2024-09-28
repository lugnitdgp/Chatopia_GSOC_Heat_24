import { auth } from "@/auth";
// import { NextApiRequest , NextApiResponse } from "next";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

import getActiveList from "@/app/actions/getActiveList";

export async function GET(req: Request){
    try{
        const activeList = await getActiveList();
        return NextResponse.json(activeList);
    }
    catch(error: any){
        console.log(error);
    }
}