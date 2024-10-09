import express,{ Express,Response,Request } from "express"

const app: Express = express()
const router = express.Router()
const {getAllMessageController,addMessageController} = require("../controller/message")

router.route("/message")
    .get(async(req,res) => {
        getAllMessageController(req,res)
    })
    .post(async(req,res) => {
        addMessageController(req,res)
    })

module.exports = router