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

        // User can add themselves as a contact
        if (currentUser.email === email) {
            await prisma.request.create({
                data: {
                    senderId: currentUser.id,
                    recverId: currentUser.id,
                    status: 'accepted'
                }
            });
            
            return NextResponse.json({
                sender: currentUser,
                receiver: currentUser,
                status: 'accepted'
            }, { status: 200 });
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

        const reqFromReciever = await prisma.request.findFirst({
            where: {
                senderId: receiver.id,
                recverId: currentUser.id
            }
        });

        if (reqFromReciever) {
            return new NextResponse(`Request from ${receiver.email} exists.`, { status: 400 })
        }

        // Add the contact
        await prisma.request.create({
            data: {
                senderId: currentUser.id,
                recverId: receiver.id,
                status: 'pending'
            }
        });
        
        return NextResponse.json({
            sender: currentUser,
            receiver,
            status: 'pending'
        }, { status: 200 });

    } catch (error: any) {
      if (error.code === 'P2002') {
        return new NextResponse('Request already exists', { status: 400 });
      }
      console.log(error, 'ERROR_MESSAGES');
      return new NextResponse('InternalError', { status: 500 });
    }
  }