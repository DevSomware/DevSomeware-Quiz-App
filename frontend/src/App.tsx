import { useEffect, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { io } from "socket.io-client";
function App() {
  const [count, setCount] = useState(0)
const socket = useMemo(() => io('http://localhost:3000'), [])
useEffect(()=>{
socket.on('connect',()=>{
  console.log('connected to server',socket.id);
})
},[])
  return (
    <div className=' flex justify-center items-center'>
      <div className='h-[70vh] w-[80vw] shadow-2xl border-2 rounded-md bg-blue-200'>
       
        <h1 className='text-3xl text-center font-bold mt-2 text-green-600'>Quiz - Create or join on your room.</h1>
       <div className='grid grid-cols-2 mt-20 ml-2 mr-2'>
       <div className='bg-white flex flex-col h-80 rounded shadow-lg justify-center items-center'>
       <button className='bg-blue-600 text-white p-2 m-2 rounded w-80 hover:bg-blue-800'>
          Create Room
        </button>
        <button className='bg-blue-600 text-white p-2 m-2 rounded mt-10 w-80 hover:bg-blue-800'>
          Join Room
        </button>
       </div>
       <div className='w-full h-80'>
        <img src="https://www.dragnsurvey.com/blog/en/wp-content/webp-express/webp-images/uploads/2024/02/quiz-line-computer.jpg.webp" alt="" className='h-80 w-full'/>
       </div>
       </div>
      </div>
    </div>
  )
}

export default App
