import prisma from "@/app/libs/prismadb";

const getActiveList = async () => {
    try {
        // Fetch all active users
        const activeList = await prisma.active.findMany();

        return activeList;
    } catch (error: any) {
        return null;
    }
};

export default getActiveList;