import express,{Express, Request, Response} from "express"
import { Router } from "express"
import HTTPStatusCode from "../function/statuscode"

const app: Express = express()
const router = express.Router()
const {userGetController,userAddController,userGetByNumberPhoneController} = require("../controller/user")

router.route("/user")
    .get(async(req: Request,res: Response) => {
        userGetController(req,res)
    })
    .post(async(req: Request,res: Response) => {
        userAddController(req,res)
    })

router.route("/user/:no_telepon")
    .get(async(req: Request,res: Response) => {
        userGetByNumberPhoneController(req,res)
    })

module.exports = router