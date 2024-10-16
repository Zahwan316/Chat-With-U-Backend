"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var express_1 = require("express");
var http_1 = require("http");
var cors_1 = require("cors");
var socket_io_1 = require("socket.io");
var axios_1 = require("axios");
var socketIo = require("socket.io");
var userRoute = require("./route/user");
var messageRoute = require("./route/message");
var authRoute = require("./route/auth");
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = process.env.PORT;
var server = http_1.default.createServer(app);
var corsoption = {
    origin: "*"
};
var io = new socket_io_1.Server(server, {
    cors: corsoption
});
app.use((0, cors_1.default)(corsoption));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(userRoute);
app.use(messageRoute);
app.use(authRoute);
io.on("connection", function (socket) {
    console.log("user connected");
    socket.on("message", function (message) {
        console.log("message : ", message);
        try {
            axios_1.default.post("http://localhost:3000/message", message);
        }
        catch (e) {
            console.log(e);
        }
        io.emit("message", message);
    });
    socket.on("disconnect", function () {
        console.log("user disconnect");
    });
});
app.get("/", function (req, res) {
    res.status(200).json({
        message: "Index Page"
    });
});
server.listen(port, function () {
    console.log("running at port:".concat(port));
});
