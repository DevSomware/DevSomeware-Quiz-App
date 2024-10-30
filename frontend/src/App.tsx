import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'
import { io } from "socket.io-client";
import { Toaster,toast } from 'react-hot-toast';
function App() {
  const router =useNavigate();
 const [isshowromm,setIsShowRoom]=useState(false);
 const [roomcode,setroomcode]=useState('');
const socket = useMemo(() => io('http://localhost:3000'), [])
useEffect(()=>{
socket.on('connect',()=>{
  console.log('connected to server',socket.id);
})
},[])
const handleJoinRoom=()=>{
const data= prompt('Enter room code');
if(data==null||data==""){
  alert('Please enter a valid room code');
  return;
}
router(`/room?roomcode=${data}`);
}
const handleCreateRooom=()=>{
const roomcode:string=Math.random().toString(36).substring(7);
setroomcode(roomcode.toString());
socket.emit("createroom",{room:roomcode});
setIsShowRoom(true);
toast.success("Room created successfully!");
}
//handle user input
const handleUserInput = ()=>{
  console.log("toggling user input");
socket.emit('enteryourname',{room:roomcode,yes:true});
}
  return (
    <div className=' flex justify-center items-center'>
      <Toaster position='top-right'/>
      <div className='h-[70vh] w-[80vw] shadow-2xl border-2 rounded-md bg-blue-200'>
       
        <h1 className='text-3xl text-center font-bold mt-2 text-green-600'>Quiz - Create or join on your room.</h1>
       <div className='grid grid-cols-2 mt-20 ml-2 mr-2'>
       {!isshowromm&&<div className='bg-white flex flex-col h-80 rounded shadow-lg justify-center items-center'>
       <button className='bg-blue-600 text-white p-2 m-2 rounded w-80 hover:bg-blue-800' onClick={handleCreateRooom}>
          Create Room
        </button>
        <button className='bg-blue-600 text-white p-2 m-2 rounded mt-10 w-80 hover:bg-blue-800' onClick={handleJoinRoom}>
          Join Room
        </button>
       </div>}
       {isshowromm&&<div className='flex justify-center items-center flex-col'>
        <button className='bg-blue-600 text-white p-2 m-2 rounded w-80 hover:bg-blue-800' onClick={handleUserInput}>
          Get a user input!
        </button>
        </div>}
       <div className='w-full h-80 bg-white'>
        {!isshowromm&&<img src="https://www.dragnsurvey.com/blog/en/wp-content/webp-express/webp-images/uploads/2024/02/quiz-line-computer.jpg.webp" alt="" className='h-80 w-full'/>}
        {isshowromm&&<div className=' flex justify-center items-center text-3xl h-full shadow-2xl rounded-full'>
        Joining Room Code is <span className='bg-green-600 text-white font-bold p-4'>{roomcode}</span>
        </div>}
       </div>
       
       </div>
      </div>
    </div>
  )
}

export default App
