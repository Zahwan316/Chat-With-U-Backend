import dotenv from "dotenv"
import express,{Express,Request,Response} from "express"
import { WebSocket } from "ws"
import {createServer} from "http"
import http from 'http';
import cors from "cors"
import {Server as SocketIoServer} from "socket.io"
import axios from "axios";
import status from "./types/status";
import onlineUser from "./types/onlineUser";

//import route
const socketIo = require("socket.io")
const userRoute = require("./route/user")
const messageRoute = require("./route/message")
const authRoute = require("./route/auth")
const statusRoute = require("./route/status")
const groupRoute = require("./route/group")

dotenv.config()

const app: Express = express()
const port = process.env.PORT

const server = http.createServer(app)
const corsoption = {
    origin:"*"
}
const io = new SocketIoServer(server,{
    cors: corsoption
})

//route config
app.use(cors(corsoption))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//set route
app.use(userRoute)
app.use(messageRoute)
app.use(authRoute)
app.use(statusRoute)
app.use(groupRoute)
//local state
let onlineUser: onlineUser[] = []

//socket logic
io.on("connection",(socket: any) => {
    console.log("user connected")

    socket.on("message",(message:any) => {
        console.log("message : ",message)

        try{
            axios.post("http://localhost:3000/api/message",message,{
                "headers":{
                  "Authorization":`Bearer ${message?.token}`
                }
              })
        }
        catch(e){
            console.log(e)
        }
        io.emit("message",message)
    })

    socket.on("status",(message: any) => {
        console.log(message)
        try{
            axios.post("http://localhost:3000/api/status",message,{
                "headers":{
                  "Authorization":`Bearer ${message?.token}`
                }
              })
        }
        catch(e){
            console.log(e)
        }
        io.emit("status",message)
    })

    socket.on("deleteStatus",async(message: any) => {
        let data: status[] = []
        try{
            const resDelete = await axios.delete("http://localhost:3000/api/status/id/"+message?.id,{
                "headers":{
                  "Authorization":`Bearer ${message?.token}`
                }
              })

            const res = await axios.get("http://localhost:3000/api/status",{
              "headers":{
                "Authorization":`Bearer ${message?.token}`
              }
            })

            const dataresponse = res.data.data

            data.push(...dataresponse)
            console.log(data)
        }
        catch(e){
            console.log(e)
        }

        io.emit("refresh-status",data)
    })

    socket.on("online",(id: any) => {
        if(!onlineUser.some((user) => user.userid === id)){
            onlineUser.push({userid:id,socketid:socket.id})
        }

        io.emit('getUser',onlineUser)
    })

    socket.on("disconnect",() => {
        onlineUser = onlineUser.filter((user) => user.socketid != socket.id)
        console.log("user disconnect")

        io.emit("getUser",onlineUser)
    })
})


app.get("/",(req: Request,res: Response) => {
    res.status(200).json({
        message:"Index Page"
    })
}) 

server.listen(port,() => {
    console.log(`running at port:${port}`)
})