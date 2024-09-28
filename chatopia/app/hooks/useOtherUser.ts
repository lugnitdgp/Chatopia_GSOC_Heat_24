import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType , userConversation } from "../types";
// import { UserConversation } from "@prisma/client";

const useOtherUser = (conversation: 
    FullConversationType | {userConversations : userConversation[]}
) => {
    const session = useSession();
    const users = conversation.userConversations.map((userConversation) => userConversation.user);
    
    
    const otherUser = useMemo(() => {
        const currentUserEmail = session?.data?.user?.email;
        const otherUser = users.filter((user) => user.email !== currentUserEmail);
        return otherUser[0];
    }, [session?.data?.user?.email, users]);

    return otherUser;
};

export default useOtherUser;