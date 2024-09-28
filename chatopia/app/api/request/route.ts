import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const {email} = await request.json();

        // If user is not logged in, return unauthorized
        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // User cannot add themselves as a contact
        if (currentUser.email === email) {
            return new NextResponse('Cannot add yourself as a contact', { status: 400 });
        }

        // Obtain the user to be added as a contact
        const receiver = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        // If user does not exist, return not found
        if (!receiver) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Add the contact
        await prisma.request.create({
            data: {
                senderId: currentUser.id,
                recverId: receiver.id,
                status: 'pending'
            }
        });
        

        return new NextResponse('Success', { status: 200 });

    } catch (error: any) {
      console.log(error, 'ERROR_MESSAGES');
      return new NextResponse('InternalError', { status: 500 });
    }
  }