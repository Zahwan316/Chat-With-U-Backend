import express,{ Express,Response,Request } from "express"
import validateToken from '../middleware/validateToken';

const app: Express = express()
const router = express.Router()
const {getAllMessageController,addMessageController} = require("../controller/message")

router.route("/api/message")
    .get(validateToken,async(req,res) => {
        getAllMessageController(req,res)
    })
    .post(validateToken,async(req,res) => {
        addMessageController(req,res)
    })

module.exports = router