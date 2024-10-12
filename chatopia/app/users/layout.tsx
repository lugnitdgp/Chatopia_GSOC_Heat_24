import Sidebar from '../components/sidebar/Sidebar';
import getUsers from '../actions/getUsers';
import getContacts from '../actions/getContacts';
import getCurrentUser from '../actions/getCurrentUser';
import UserList from './components/UserList';
import getRequests from '../actions/getRequests';
import RequestList from './components/RequestList';

export default async function UsersLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  const requests = await getRequests();
  console.log(requests, 'REQUESTS');

  const accepted = requests.filter((request: any) => request.status === 'accepted');
  const pending = requests.filter((request: any) => request.status === 'pending');

  const users = accepted.map((request: any) => { 
    if (request.senderId === currentUser?.id) {
      return request.recverId;
    } else {
      return request.senderId;
    }
  });

  const sent = pending.filter((request: any) => request.senderId === currentUser?.id); // Pending requests sent by the user
  const received = pending.filter((request: any) => request.recverId === currentUser?.id); // Pending requests received by the user

  const contacts = await getContacts(users);
  const sentUsers = await getContacts(sent.map((request: any) => request.recverId)) ;
  const receivedUsers = await getContacts(received.map((request: any) => request.senderId));

  // const contacts = await getUsers();  
  return (
      <Sidebar>
        <div style={{height:"100vh" , display:"flex"}}>
          <UserList currentUserId={currentUser.id} items={contacts} />
          {children}
          <RequestList sentUsers={sentUsers} recvdUsers={receivedUsers}/>
        </div>
        
      </Sidebar>
  )
};