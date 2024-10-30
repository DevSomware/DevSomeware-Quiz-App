import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
const Joinroom = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const roomcode = query.get("roomcode");
  const [name,setName]=useState('');
  const [isconnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  //web sockets connection
  //take user input func
  const takeuserInput=():string|null=>{
    let p:string|null = prompt("Please enter your name");
    if(p==null||p==""){
        p="Anonymous";
    }
    setName(p);
    localStorage.setItem("name",p);
    return p;
 }
  const socket = useMemo(() => io("http://localhost:3000"), []);
  useEffect(() => {
    socket.on("connect", () => {
      let result:string|null = "";
      setIsConnected(true);
      socket.emit("joinroom", { room: roomcode });
       //taking user input
       result = takeuserInput();
       setName(result);
       socket.emit("adduser",{room:roomcode,user:result});
    });

    socket.on("participants", (data) => {
        const length:number = data.length;
        const lastuser = data[length-1];
        toast.success(lastuser+" Joined the Room")
        setParticipants(data);
    })
    //if questions asked
    socket.on("userinputcreated",(data)=>{
     console.log("user input created",data);
      let a = prompt(data.question);
      socket.emit("sendtoadmin",{room:roomcode,answer:a,socketid:data.socketid,name:localStorage.getItem("name")});
    })
    //if user is left
    socket.on("userleft",(data)=>{ 
      setParticipants(data.data);
      toast.error(data.user+" left the room");
    })
    //handletabclose
    const handleBeforeunload=()=>{
      socket.emit("removeuser",{room:roomcode,user:localStorage.getItem("name")});
      socket.disconnect();
    }
    //event listener
    window.addEventListener("beforeunload",handleBeforeunload);
    return ()=>{
      socket.emit("removeuser",{room:roomcode,user:localStorage.getItem("name")});
      socket.disconnect();
      window.addEventListener("beforeunload",handleBeforeunload);
    }
    
  }, []);
  console.log("roomcode is ",roomcode,"isconnected is ",isconnected,"name is ",name)
 console.log("name is ",name)
  return (
    <>
      <div className="min-h-screen flex justify-center items-center ">
        <Toaster position="top-right" />
        <div className="font-bold">
          Quiz started soon....
          <p className="mt-6">
            Joining room code is{" "}
            <span className="bg-green-600 text-white p-2 ">{roomcode}</span>
          </p>
          {!isconnected && (
            <p className="mt-4">
              Please wait while we are connecting to one of our server...
            </p>
          )}
          {isconnected && <p className="mt-4">You are connected..</p>}
        </div>
      </div>
      <div className="absolute right-0 top-0 bg-blue-200 h-full w-72 max-h-[100vh] overflow-y-scroll mt-2 scroll-smooth">
        <h1 className="font-bold text-2xl  bg-blue-600 text-white sticky top-0 ">
          Participants
        </h1>
        <ul className="">
          {participants.map((participant) => {
            return (
              <li className="font-semibold text-lg p-1 bg-blue-300 w-full mt-2 rounded-full text-center text-gray-800">
                {participant.toUpperCase()}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Joinroom;
