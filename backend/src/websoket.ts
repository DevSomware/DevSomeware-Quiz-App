import { count } from "console";
import { Server } from "socket.io";
const websocket =(httpserver:any)=>{
    const io = new Server(httpserver,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true
        },
    })
    var arr:any={};
    var feedbackarr:any=[];
    var quizarr:any=[];
    var leaderboard:any=[];
    io.on("connection",(socket)=>{
        console.log("connected to server"+socket.id);
        socket.on("disconnect",(data)=>{
            console.log("disconnected from server",data);
        })
        //creating room
        socket.on("createroom",(data:{room:string})=>{
            arr[data.room]=[];
        })
        //joining room
        socket.on("joinroom",(data)=>{
            console.log("joining room",data.room);
            socket.join(data.room); 
        })
        //not in use
        socket.on("enteryourname",(data)=>{
            console.log("enter your name",data);
            socket.to(data.room).emit("turnonprompt",data.yes);
        })
        //add user to room
        socket.on("adduser",(data)=>{
            console.log("adding user",data);
            if(!arr[data.room]){
                arr[data.room]=[];
            }
            arr[data.room].push(data.user);
            io.to(data.room).emit("participants",arr[data.room]);
        })
        //remove user from room
    socket.on("removeuser",(data)=>{
        console.log("removing user",data);
        arr[data.room]=arr[data.room].filter((user:any)=>user!=data.user);
        socket.to(data.room).emit("userleft",{data:arr[data.room],user:data.user});
    })
    //create user input
    socket.on("createuserinput",(data)=>{
        console.log("creating user input",data);

        io.to(data.room).emit("userinputcreated",{question:data.question,socketid:data.socketid});
    })
    //sending usermessage to admin
    socket.on("sendtoadmin",(data)=>{
        console.log("sending to admin",data);
        io.to(data.socketid).emit("usermessage",{name:data.name,answer:data.answer});
    })
    //create alert
    socket.on("createalert",(data)=>{
        console.log("creating alert",data);
        io.to(data.room).emit("alertcreated",{message:data.message});
    })
    //take feedback
    socket.on("createfeedback",(data)=>{
        console.log("taking feedback",data);
        let roomfeedback = feedbackarr.find((f:any)=>f.room==data.room);
        if(!roomfeedback){
           let temparr:any = {
                totalcount: 0,
                room: data.room,
                ratings: [
                    { rating: 1, percentage: 0, count: 0 },
                    { rating: 2, percentage: 0, count: 0 },
                    { rating: 3, percentage: 0, count: 0 },
                    { rating: 4, percentage: 0, count: 0 },
                    { rating: 5, percentage: 0, count: 0 }
                ]
            };
            feedbackarr.push(temparr);
        }
        console.log("feedbackarr",feedbackarr);
        let roomdata = feedbackarr.find((f:any)=>f.room==data.room);
        io.to(data.room).emit("takefeedback",{type:"feedback",socketid:data.socketid});
        //sendingfeedback to admin
        io.to(data.socketid).emit("feedbackratings",roomdata.ratings);
    });
    //rating socket
    socket.on("rating",(data)=>{
        console.log("rating",data);
        let roomfeedback = feedbackarr.find((f:any)=>f.room==data.room);
        if(roomfeedback){
            roomfeedback.totalcount+=1;
            roomfeedback.ratings[data.rating-1].count+=1;
            roomfeedback.ratings.map((rate:any)=>{
                rate.percentage = (rate.count/roomfeedback.totalcount)*100;
            })
        }
        console.log("feedbackarr",feedbackarr);
        console.log("socketid",data.socketid)
        io.to(data.socketid).emit("feedbackratings",roomfeedback.ratings);
    })
    //quiz started 
    socket.on("quizstarted",(data)=>{
        console.log("quiz started",data);
        io.to(data.room).emit("quizstart",data.message);
    })
    //send quiz
    socket.on("sendquiz",(data)=>{
        console.log("sending quiz",data);
    let findquiz = quizarr.find((q:any)=>q.room==data.room);
    if(!findquiz){
        let tempquizarr = {
            room: data.room,
            questions: data.quiz.question,
            options: data.quiz.options,
            correctOption: data.quiz.correctOptionId,
            totalvote:0,
        }
        quizarr.push(tempquizarr);
        //make a leader board for this perticular quiz
    }
     else{
            findquiz.questions = data.quiz.question;
            findquiz.options = data.quiz.options;
            findquiz.correctOption = data.quiz.correctOptionId;
            findquiz.totalvote = 0;
     }
     let findleaderboard = leaderboard.find((l:any)=>l.room==data.room);
        if(!findleaderboard){
            let temparr = {
                room: data.room,
                leaderboard: [],
                correctOption:data.quiz.correctOptionId
            }
            leaderboard.push(temparr);
        }
        else{
            findleaderboard.leaderboard=[];
            findleaderboard.correctOption=data.quiz.correctOptionId;
        }
     console.log("quizarr",quizarr);
     let roomquiz = quizarr.find((q:any)=>q.room==data.room);
        io.to(data.room).emit("getquiz",{quiz:roomquiz,socketid:data.socketid,new:true});
    }) 
    //publish answer
    socket.on("publishanswer",(data)=>{
        console.log("publish answer",data);
        io.to(data.room).emit("publishanswer",{socketid:data.socketid,ispublish:true});               
    })
    //calculate percentage and update vote
    socket.on("vote",(data)=>{
        console.log("vote",data);
        //add in laeader board
        let findleaderboard = leaderboard.find((l:any)=>l.room==data.room);
        if(findleaderboard){
            let ldata = {name:data.name,option:data.option,time:data.time}
            findleaderboard.leaderboard.push(ldata);
        }
        //printing leader board on a every request
        console.log("finalleader board is",findleaderboard);
        console.log("leader board is",leaderboard);
        let findquiz = quizarr.find((q:any)=>q.room==data.room);
        if(findquiz){
            findquiz.totalvote+=1;
            findquiz.options.map((option:any)=>{
                if(option.id==data.option){
                    option.totalcount+=1;
                }
            })
            findquiz.options.map((option:any)=>{
                option.percentage = (option.totalcount/findquiz.totalvote)*100;
            })
        }
        console.log("quizarr",quizarr);
        io.to(data.room).emit("getquiz",{quiz:findquiz,socketid:data.socketid,new:false});
        //sends to admin
        io.to(data.socketid).emit("getquiz",{quiz:findquiz,socketid:data.socketid,new:false});
    }) 
    //show leader board
    socket.on("showleaderboard",(data)=>{
        let findleaderboard = leaderboard.find((l:any)=>l.room==data.room);
        let filtercorrect = findleaderboard.leaderboard.filter((l:any)=>l.option==findleaderboard.correctOption);
        
        filtercorrect.sort((a:any,b:any)=>a.time-b.time);
        console.log("filterlederboarddatais",filtercorrect);

       io.to(data.room).emit("showleaderboard",{socketid:data.socketid,data:filtercorrect});
       io.to(data.socketid).emit("showleaderboard",{socketid:data.socketid,data:filtercorrect});
    })
    //endtest socket
    socket.on("endtest",(data)=>{
        console.log("endtest",data);
        io.to(data.room).emit("endtest",{socketid:data.socketid});
    })

    }) 
}
export default websocket