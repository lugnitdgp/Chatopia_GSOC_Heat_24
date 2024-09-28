import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import getSession from "./getSession";

const getUsers = async ( userIds : String[]) => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return [];
    }

    // Fetch users from the database
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      }
    });

    return users;
    
  } catch (error: any) {
    return [];
  }
};

export default getUsers;