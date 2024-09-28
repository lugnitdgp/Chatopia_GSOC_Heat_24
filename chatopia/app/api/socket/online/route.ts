import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request : Request){
    try{
        const { email } = await request.json();
        
        // Fetch the user from the database having given email
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        // CREATE the row from active table where id is the email
        if(user){
            await prisma.active.create({
                data: {
                    id: user.id , email: user.email
                }
            });
        }
    }
    catch(error: any){
        return new NextResponse('Internal Error', { status: 500 });
    }
}
