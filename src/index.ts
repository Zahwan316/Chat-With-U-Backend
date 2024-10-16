import dotenv from "dotenv"
import express,{Express,Request,Response} from "express"
import { WebSocket } from "ws"
import {createServer} from "http"
import http from 'http';
import cors from "cors"
import {Server as SocketIoServer} from "socket.io"
import axios from "axios";

const socketIo = require("socket.io")
const userRoute = require("./route/user")
const messageRoute = require("./route/message")
const authRoute = require("./route/auth")

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

app.use(cors(corsoption))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(userRoute)
app.use(messageRoute)
app.use(authRoute)

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

    socket.on("disconnect",() => {
        console.log("user disconnect")
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