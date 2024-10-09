import { WebSocket } from "ws";

const ws = new WebSocket("ws://localhost:8080")

ws.on("open",() => {
    console.log("connected to server")

    ws.send("Halo, Server")
})

ws.on("message",(message: string) => {
    console.log(`mendapatkan pesan dari server: ${message}`)
})

ws.on("close",() => {
    console.log('disconnected from server')
})