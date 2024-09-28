import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const existingConversation = await prisma.conversation.findMany({
      where: {
        id: conversationId
      },
      include: {
        userConversations:{
            include:{
                user:true
            }
        }
      }
    });

    if (!existingConversation[0]) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    const users = existingConversation[0].userConversations.map((userConversation)=>userConversation.user);

    if(users.filter((user)=>user.id === currentUser.id).length === 0){
        return new NextResponse('Unauthorized', { status: 401 });
    }

    console.log('Authorized to delete conversation', conversationId)

    const deletedConversation = await prisma.conversation.delete({
      where: {
        id: conversationId
      }
    });

    console.log(deletedConversation, 'DELETED_CONVERSATION');

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log(error, 'ERROR_CONVERSATION_DELETE');
    return new NextResponse('Internal Error', { status: 500 });
  }
} 