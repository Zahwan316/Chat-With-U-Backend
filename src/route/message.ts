import express,{ Express,Response,Request } from "express"
import validateToken from '../middleware/validateToken';

const app: Express = express()
const router = express.Router()
const {getAllMessageController,addMessageController,getGroupMessageController} = require("../controller/message")

router.route("/api/message")
    .get(validateToken,async(req,res) => {
        getAllMessageController(req,res)
    })
    .post(validateToken,async(req,res) => {
        addMessageController(req,res)
    })

router.route("/api/message/group_id/:group_id")
    .get(validateToken,async(req,res) => {
        getGroupMessageController(req,res)
    })
    
module.exports = router