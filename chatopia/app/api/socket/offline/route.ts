import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request : Request){
    try{
        const { email } = await request.json();
        // DELETE the row from active table where id is the email

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if(user){
            await prisma.active.delete({
                where: {
                    email: email
                }
            });
        }

    }
    catch(error: any){
        return new NextResponse('Internal Error', { status: 500 });
    }
}