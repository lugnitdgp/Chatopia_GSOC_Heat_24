import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc'
      },
      where: {
        userConversations: {
          some: {
            userId: currentUser.id
          }
        }
      },
      include: {
        userConversations: {
            include: {
              user: true
            }
        },
        messages: {
            include: {
                sender: true,
                userSeenMessages: {
                    include: {
                        user: true
                    }
                }
            }
        }
      }
    });
    // console.log(conversations[0]);
    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;