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

        // Obtain the request to be accepted
        const req = await prisma.request.findFirst({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                senderId: userId,
                                recverId: currentUser.id
                            },
                            {
                                senderId: currentUser.id,
                                recverId: userId
                            }
                        ]
                    },
                    {
                        status: 'pending'
                    }
                ]
            }
        });

        // If request does not exist, return not found
        if (!req) {
            return new NextResponse('Request not found', { status: 404 });
        }

        // Accept the request
        await prisma.request.update({
            where: {
                id: req.id
            },
            data: {
                status: 'accepted'
            }
        });

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                contacts: {
                    push: currentUser.email
                }
            }
        });

        await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                contacts: {
                    push: userEmail
                }
            }
        });

        // Accept the request
        await prisma.request.update({
            where: {
                id: req.id
            },
            data: {
                status: 'accepted'
            }
        });

        const sender = await prisma.user.findUnique({
            where: {
                email: userEmail
            }
        });

        return NextResponse.json({
            sender,
            receiver: currentUser
        }, { status: 200 });

    } catch (error: any) {
      console.log(error, 'ERROR_MESSAGES');
      return new NextResponse('InternalError', { status: 500 });
    }
  }