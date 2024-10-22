import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request
) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      message,
      file,
      fileType,
      conversationId,
      isForwarded
    } = body;

    // If user is not logged in, return unauthorized
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Create new message , and add it to the conversation
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        file: file,
        fileType,
        isForwarded: !!isForwarded,
        conversation: {
          connect: { id: conversationId }
        },
        sender: {
          connect: { id: currentUser.id }
        },
        userSeenMessages: {
            create: {
                user: {
                  connect: { id: currentUser.id }
                }
            }
        }
      },
      include: {
        sender: true,
        userSeenMessages: {
            include: {
              user: true
            }
        }
      }
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id
          }
        }
      },
      include: {
        userConversations:{
            include: {
                user: true
            }
        },
        messages: {
            include: {
                userSeenMessages: {
                    include: {
                        user: true
                    }
                }
            }
        }
      }
    });

    // Emit the new message to the conversation room
    console.log('EMITTING_MESSAGE', newMessage);
    // socket.emit('send_message', newMessage);

    return NextResponse.json(newMessage);
  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('InternalError', { status: 500 });
  }
}