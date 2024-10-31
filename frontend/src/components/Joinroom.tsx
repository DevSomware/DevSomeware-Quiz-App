import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Viewmcq from "./utlils/Viewmcq";
import Leaderboard from "./utlils/LeaderBoard";
import { useNavigate } from "react-router-dom";
const Joinroom = () => {
  const location = useLocation();
  const router = useNavigate();
  const query = new URLSearchParams(location.search);
  const roomcode = query.get("roomcode");
  const [name,setName]=useState('');
  const [isconnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [issFeedback,setIsFeedback]=useState(false);
  const [isquizstarted,setIsQuizStarted]=useState(false);
  const [quizdata,setQuizData]=useState(null);
  const [message,setMessage]=useState("");
  const[socketid,setSocketId]=useState('');
  const [rating, setRating] = useState(0); // Stores the user's selected rating
  const [isanswerPublish,setIsAnswerPublish]=useState(false);
  const [showleaderboard,setShowLeaderBoard]=useState(false);
 const [isitnew,setIsItNew]=useState(false);
 const [leaderboard,setLeaderBoard]=useState([]);
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
      setQuizData(null);
    })
    //alert created
    socket.on("alertcreated",(data)=>{
      toast.success(data.message);
      setQuizData(null);
    })
    //take feedback
    socket.on("takefeedback",(data)=>{
      setIsFeedback(true);
      setIsQuizStarted(false);
      setShowLeaderBoard(false);
      setSocketId(data.socketid);
      toast.success("Feedback form is open, Please rate your experience");
      console.log("taking feedback",data);
      setQuizData(null);
    })
    //quiz start
    socket.on("quizstart",(data)=>{
      setIsFeedback(false);
      setShowLeaderBoard(false);
      console.log("quiz started",data);
      setIsQuizStarted(true);
      console.log("quiz started",data);
      setMessage(data);
    })
    //get quiz
    socket.on("getquiz",(data)=>{
      setIsFeedback(false);
      setIsQuizStarted(true);
    setShowLeaderBoard(false);
      console.log("quiz data is ",data);
      toast.success("You have received a quiz");
      setSocketId(data.socketid);
      setQuizData(data.quiz);
      setIsItNew(data.new);
    })
    //puiblish answer
    socket.on("publishanswer",(data)=>{
      console.log("answer published",data);
      setSocketId(data.socketid);
      if(data.ispublish){
  setIsAnswerPublish(true);
      }
    })
    //if user is left
    //show leader board
    socket.on("showleaderboard",(data)=>{
      setLeaderBoard(data.data);
      setIsFeedback(false);
      setIsQuizStarted(false);
      setShowLeaderBoard(true);
      toast.success("Leaderboard loaded successfully");
    })
    //testend 
    socket.on("endtest",(data)=>{
      setIsFeedback(false);
      setIsQuizStarted(false);
      setShowLeaderBoard(false);
      toast.error("Test ended");
      toast.success("returning to home page");
router('/');
    })
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
  //handling rating
  const handleRating = (value) => {
    console.log("rating is ",value)
    setRating(value);
    socket.emit("rating",{room:roomcode,rating:value,socketid:socketid});
    toast.success("Thank you for your feedback");
  };
  console.log("roomcode is ",roomcode,"isconnected is ",isconnected,"name is ",name)
 console.log("name is ",name)
//handle votebasir
  const handleVote = (option,time) => {
    console.log("voting",option);
    socket.emit("vote",{room:roomcode,option:option,socketid:socketid,name:localStorage.getItem("name"),time:10-time});
  };
  return (
    <>
      <div className="min-h-screen flex justify-center items-center ">
        <Toaster position="top-right" />
        {!issFeedback&&!isquizstarted&&!showleaderboard&&<div className="font-bold">
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
        </div>}
        {issFeedback&&!isquizstarted&&!showleaderboard&&<div>
          <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Rate Your Experience. How was the quiz ?</h2>
      <div className="flex justify-center items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className={`text-3xl ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <p className="text-center mt-4 text-gray-600">
        {rating > 0 ? `You rated this ${rating} out of 5` : 'Please select a rating'}
      </p>
    </div>
          </div>}
          {isquizstarted&&!issFeedback&&!showleaderboard&&<div><Viewmcq quizdata={quizdata} isanswerPublish={isanswerPublish} setIsAnswerPublish={setIsAnswerPublish} isitnew={isitnew} handleVote={handleVote}/></div>}
          {!isquizstarted&&!issFeedback&&showleaderboard&&<div><Leaderboard leaderboard={leaderboard}/></div>}
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
