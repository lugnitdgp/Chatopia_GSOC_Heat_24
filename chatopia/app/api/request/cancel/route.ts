import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const {userId, userEmail} = await request.json();

        // If user is not logged in, return unauthorized
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Obtain the request to be declined
        const req = await prisma.request.findFirst({
            where: {
                senderId: currentUser.id,
                recverId: userId,
                status: 'pending'
            }
        });

        // If request does not exist, return not found
        if (!req) {
            return new NextResponse('Request not found', { status: 404 });
        }

        // Decline the request by deleting it
        await prisma.request.delete({
            where: {
                id: req.id
            }
        });

        const receiver = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        });

        return NextResponse.json({
            sender: currentUser,
            receiver
        }, { status: 200 });

    } catch (error: any) {
      console.log(error, 'ERROR_MESSAGES');
      return new NextResponse('InternalError', { status: 500 });
    }
  }