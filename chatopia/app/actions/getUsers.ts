import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";
import getSession from "./getSession";

const getUsers = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id || !currentUser?.email) {
      return [];
    }

    const { contacts } = currentUser ;


    const users = await prisma.user.findMany({
      where: {
        email: {
          in: contacts
        }
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;