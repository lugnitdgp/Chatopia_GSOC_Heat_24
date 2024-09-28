import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

const getRequests = async () => {
  try {
    const currentUser = await getCurrentUser();
    
    // If user is not logged in, return unauthorized
    if (!currentUser?.id || !currentUser?.email) {
      return [];
    }

    const requests = await prisma.request.findMany({
      where: {
        OR: [
          {
            senderId: currentUser?.id
          },
          {
            recverId: currentUser?.id
          }
        ],
        NOT: {
          status: 'accepted'
        }
      }
    });

    return requests;
  } catch (error: any) {
    return [];
  }
}

export default getRequests;