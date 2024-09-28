import getRequests from '@/app/actions/getRequests';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { User } from "@prisma/client";
import styles from './RequestList.module.css';
import RecievedRequestBox from './ReceivedRequestBox';
import SentRequestBox from './SentRequestBox';
import getPendingRequests from '@/app/actions/getPendingRequests'
import getContacts from '@/app/actions/getContacts';
import ReceivedList from './ReceivedList';
import SentList from './SentList';


interface RequestListProps {
    sentUsers: User[];
    recvdUsers: User[];
}

const RequestList : React.FC<RequestListProps> = ({sentUsers , recvdUsers}) =>

// export default async function RequestList() 
{
    // const pending = await getPendingRequests();
    // const currentUser = await getCurrentUser();

    // if(!currentUser) {
    //     return null;
    // }

    // const sent = pending.filter((request: any) => request.senderId === currentUser?.id); // Pending requests sent by the user
    // const received = pending.filter((request: any) => request.recverId === currentUser?.id); // Pending requests received by the user

    // const sentUsers = await getContacts(sent.map((request: any) => request.recverId)) ;
    // const recvdUsers = await getContacts(received.map((request: any) => request.senderId));
    
    return (
        <div className={styles.container}>
            {/* <div className = {styles.recvd}>
                <h3>Received</h3>
                {recvdUsers.map((user) => (
                    <RecievedRequestBox key={user.id} data={user} />
                ))}
            </div> */}
            <ReceivedList data={recvdUsers} />
            {/* <div className = {styles.sent}>
                <h3>Sent</h3>
                {sentUsers.map((user) => (
                    <SentRequestBox key={user.id} data={user} />
                ))}
            </div> */}
            <SentList data={sentUsers} />
        </div>
    )
}

export default RequestList;