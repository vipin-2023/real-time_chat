import React, { useEffect, useRef, useState } from "react";
import Avatar from "../../assets/elon.jpg";
import Conv1 from "../../assets/mark.jpeg";
import Img1 from "../../assets/img1.png";
import Img2 from "../../assets/img2.png";
import Img3 from "../../assets/img3.png";
import Img4 from "../../assets/img4.png";
import Img5 from "../../assets/img5.png";
import Img6 from "../../assets/img6.png";






import Input from "../../componats/input";
import { io } from 'socket.io-client'

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
  const [conversations, setConversations] = useState([]);
  const messageRef = useRef(null)
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState({});
  console.log('messages',messages)
  const [users, setUsers] = useState([])
  

  const images = [
     Img1, Img2, Img3,Img4,Img5, Img6
  ];
  if(users){
    users.forEach((item,index)=>{
      item.user.img=images[index];
	console.log(item.user);
    })
  }
  console.log(users);

  // useEffect(() => {
	// 	setSocket(io('http://localhost:8080'))
	// }, [])
 
  const fetchMessages = async (conversationId, receiver) => {

		const res = await fetch(`http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		});
		const resData = await res.json();
    
		setMessages({ messages: resData, receiver, conversationId })
	}
  const sendMessage = async (e) => {
		// setMessage('')
		// socket?.emit('sendMessage', {
		// 	senderId: user?.id,
		// 	receiverId: messages?.receiver?.receiverId,
		// 	message,
		// 	conversationId: messages?.conversationId
		// });
		const res = await fetch(`http://localhost:8000/api/message`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				conversationId: messages?.conversationId,
				senderId: user?.id,
				message,
				receiverId: messages?.receiver?.receiverId
			})
		});
	}
  useEffect(() => {
		const fetchUsers = async () => {
			const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});
			const resData = await res.json();
      
      console.log(resData)
			setUsers(resData)
		}
		fetchUsers()
	}, [])


  useEffect(() => {
		const loggedInUser = JSON.parse(localStorage.getItem('user:detail'))
		const fetchConversations = async () => {
			const res = await fetch(`http://localhost:8000/api/conversations/${loggedInUser?.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				}
			});
			const resData = await res.json()
      console.log(resData)
			setConversations(resData)
		}
		fetchConversations();
	}, [user]);



if(conversations){
  var newList =[]
  conversations.forEach((item)=>{
    newList.push(item.user.receiverId);
  });
}


if(conversations && users){

  var result = users.filter(item=>newList.includes(item.user.receiverId));
 
  

}
  
  return (
    <div className="bg-[#edf3fc] h-screen flex justify-center items-center">
      <div className="w-screen flex">
        <div className="w-[25%] border h-screen bg-secondary overflow-y-scroll scrollbar-hide">
          <div className="flex items-center my-8 mx-14">
            <div>
              <img
                className="border border-primary p-[2px] rounded-full object-cover"
                src={Avatar}
                alt="avatar"
                width={"70"}
                height={"70"}
              />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl">{user.fullName}</h3>
              <p className="text-lg font-light">My account</p>
            </div>
          </div>
          <hr />
          <div className="mx-14 mt-10">
            <div className="text-primary text-lg">Messages</div>
            <div>
              { conversations.length > 0 ?conversations.map(({ conversationId, user  },index) => {
                console.log(index)
                return (
                  <div className="flex  items-center py-4 border-b border-b-gray-300">
                    <div className="cursor-pointer flex items-center" onClick={() => fetchMessages(conversationId, user)} >
                      <div>
                        <img src={result[index]?.user.img} alt="avatar" width={60} height={60}  className=" p-[2px] rounded-full"/>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-lg">{user.fullName}</h3>
                        <p className="text-sm font-light text-gray-600">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }): <div className='text-center text-lg font-semibold mt-24'>No Conversations</div>}
            </div>
          </div>
        </div>
        <div className="w-[50%] h-screen bg-white flex flex-col items-center">
        {
					messages?.receiver?.fullName ?
					<div className='w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 py-2'>
						<div className='cursor-pointer'><img src={messages?.receiver?.img} width={60} height={60} className="rounded-full" /></div>
						<div className='ml-6 mr-auto'>
							<h3 className='text-lg'>{messages?.receiver?.fullName}</h3>
							<p className='text-sm font-light text-gray-600'>{messages?.receiver?.email}</p>
						</div>
						<div className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-phone"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"></path>
              </svg>
            </div>
            <div className="cursor-pointer ml-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-brand-zoom"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M17.011 9.385v5.128l3.989 3.487v-12z"></path>
                <path d="M3.887 6h10.08c1.468 0 3.033 1.203 3.033 2.803v8.196a.991 .991 0 0 1 -.975 1h-10.373c-1.667 0 -2.652 -1.5 -2.652 -3l.01 -8a.882 .882 0 0 1 .208 -.71a.841 .841 0 0 1 .67 -.287z"></path>
              </svg>
            </div>
					</div>:<div className='w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 py-2'></div>
				}
         
          <div className="h-[75%] w-full overflow-y-scroll scrollbar-hide ">
            <div className=" px-10 py-14">
            {
							messages?.messages?.length > 0 ?
								messages.messages.map(({ message, user: { id } = {} }) => {
									return (
										<>
										<div className={`max-w-[40%] rounded-b-xl p-4 mb-6 ${id === user?.id ? 'bg-primary text-white rounded-tl-xl ml-auto' : 'bg-secondary rounded-tr-xl'} `}>{message}</div>
										<div ref={messageRef}></div>
										</>
									)
								}) : <div className='text-center text-lg font-semibold mt-24'>No Messages or No Conversation Selected</div>
						}
            </div>
          </div>

          <div className="p-10 w-full flex items-center">
            <Input
              placeholder="Type a message..."
              className="w-[75%]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              inputClassName="p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none"
            />
            <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && 'pointer-events-none'}`} onClick={() => sendMessage()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-send"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#2c3e50"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="10" y1="14" x2="21" y2="3" />
                <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
              </svg>
            </div>
            <div className="ml-4 p-2 cursor-pointer bg-light rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-circle-plus"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#2c3e50"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="12" cy="12" r="9" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="12" y1="9" x2="12" y2="15" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-[25%] border h-screen">
        <div className='text-primary text-lg px-3 py-2'>People</div>
				<div>
					{
						users.length > 0 ?
							users.map(({ userId, user }) => {
								return (
									<div className='flex items-center py-8 border-b border-b-gray-300'>
										<div className='cursor-pointer flex items-center' onClick={() => fetchMessages('new', user)}>
											<div><img src={user?.img} className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary" /></div>
											<div className='ml-6'>
												<h3 className='text-lg font-semibold'>{user?.fullName}</h3>
												<p className='text-sm font-light text-gray-600'>{user?.email}</p>
											</div>
										</div>
									</div>
								)
							}) : <div className='text-center text-lg font-semibold mt-24'>No Conversations</div>
					}
				</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
