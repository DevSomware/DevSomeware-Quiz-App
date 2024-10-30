import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'
import { io } from "socket.io-client";
import { Toaster,toast } from 'react-hot-toast';
function App() {
  const router =useNavigate();
 const [isshowromm,setIsShowRoom]=useState(false);
 const [roomcode,setroomcode]=useState('');
 const [showadminContent,setShowAdminContent]=useState(false);
 const [compname,setCompName]=useState('');
 const [socketid,setsocketid]=useState('');
 const [usermessage,setUserMessage]=useState([]);
const socket = useMemo(() => io('http://localhost:3000'), [{}])
useEffect(()=>{
socket.on('connect',()=>{
  console.log('connected to server',socket.id);
  setsocketid(socket.id);
})

socket.on('usermessage',(data)=>{
  //@ts-ignore
  setUserMessage((prevMessages) => [...prevMessages,{name:data.name,answer:data.answer}]);
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
 setShowAdminContent(true);
 setCompName('TakeUserInput');
}
//handle create alert
const handleCreateAlert = ()=>{
  setShowAdminContent(true);
  setCompName('Alert');
}

//admin area
const CreateUserInput=(question:string)=>{
socket.emit('createuserinput',{room:roomcode,question:question,socketid:socketid});
toast.success('User input created successfully');
}
//create alert;
const CreateAlert=(message:string)=>{
socket.emit('createalert',{room:roomcode,message:message});
}
  return (
    <div className=' flex justify-center items-center'>
      <Toaster position='top-right'/>
      <div className='h-[70vh] w-[80vw] shadow-2xl border-2 rounded-md bg-blue-200'>
       
       { !isshowromm&&<h1 className='text-3xl text-center font-bold mt-2 text-green-600'>Quiz - Create or join on your room.</h1>}
       { isshowromm&&<h1 className='text-3xl text-center font-bold p-1 text-green-600 bg-gray-200'>Manage Your Quiz For Room <span className='bg-blue-600 text-white px-4 rounded-full'>{roomcode}</span></h1>}
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
        <button className='bg-blue-600 text-white p-2 m-2 rounded w-80 hover:bg-blue-800' onClick={handleCreateAlert}>
          Display a Alert
        </button>
        <button className='bg-blue-600 text-white p-2 m-2 rounded w-80 hover:bg-blue-800' onClick={handleUserInput}>
          Start the Quiz
        </button>
        <button className='bg-blue-600 text-white p-2 m-2 rounded w-80 hover:bg-blue-800' onClick={handleUserInput}>
         Take FeedBack
        </button>
        </div>}
       <div className='w-full h-80 bg-white'>
        {!isshowromm&&<img src="https://www.dragnsurvey.com/blog/en/wp-content/webp-express/webp-images/uploads/2024/02/quiz-line-computer.jpg.webp" alt="" className='h-80 w-full'/>}
        {isshowromm&&!showadminContent&&<div className=' flex justify-center items-center text-3xl h-full shadow-2xl rounded-full'>
        Joining Room Code is <span className='bg-green-600 text-white font-bold p-4 mx-2'>{roomcode}</span>
        <br/>
       
        </div>}
        {isshowromm&&showadminContent&&<div>
         {compname==='TakeUserInput'&&<TakeUserInput func={CreateUserInput} usermessage={usermessage}/>}
         {compname==='Alert'&&<Alert func={CreateAlert}/>}
        </div>}
       </div>
       
       </div>
      </div>
    </div>
  )
}

export default App

const TakeUserInput=({func,usermessage}:any)=>{
  const [question,setQuestion]=useState('');
  const handleChange =(e:any)=>{
setQuestion(e.target.value);
  }
  const SubmitQuestion = ()=>{
  func(question);
  }
  return(
    <div className='overflow-y-scroll max-h-[46vh]'>
      <h1 className='font-semibold'>Take User Input</h1>
      <input type='text' placeholder='Enter your question' className='mt-2 p-2 border-2 w-96 border-green-600 rounded' onChange={handleChange}/>
      <button className='bg-blue-600 text-white p-2 m-2 rounded  hover:bg-blue-800 w-96' onClick={SubmitQuestion}>
          Create User Input
        </button>
       {usermessage.map((data:any,)=>{
          return(
            <div className='bg-white p-2 m-2 rounded shadow-lg ' key={data.answer}>
              <h1 className='text-sm text-start'>Name: <span className='font-bold'>{data.name}</span></h1>
              <p className='text-start'>Message: <span className='font-bold'>{data.answer}</span></p>
            </div>
          )
       })}
    </div>
  )
}

const Alert=({func}:any)=>{
  const [question,setQuestion]=useState('');
  const handleChange =(e:any)=>{
setQuestion(e.target.value);
  }
  const SubmitQuestion = ()=>{
  func(question);
  }
  return(
    <div className='overflow-y-scroll max-h-[46vh]'>
      <h1 className='font-semibold'>Generate a Alert!</h1>
      <input type='text' placeholder='Enter alert message?' className='mt-2 p-2 border-2 w-96 border-green-600 rounded' onChange={handleChange}/>
      <button className='bg-blue-600 text-white p-2 m-2 rounded  hover:bg-blue-800 w-96' onClick={SubmitQuestion}>
          Create a Alert
        </button>
    </div>
  )
}

