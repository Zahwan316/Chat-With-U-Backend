import express,{Express, Request, Response} from "express"
import { Router } from "express"
import HTTPStatusCode from "../function/statuscode"
import validateToken from "../middleware/validateToken"

const app: Express = express()
const router = express.Router()
const {
    userGetController,
    userAddController,
    userGetByNumberPhoneController,
    userEditController,
    userDeleteController,
    userGetByIdConroller,
} = require("../controller/user")

router.route("/api/user")
    .get(validateToken,async(req: Request,res: Response) => {
        userGetController(req,res)
    })
    .post(validateToken,async(req: Request,res: Response) => {
        userAddController(req,res)
    })

router.route("/api/user/:no_telepon")
    .get(validateToken,async(req: Request,res: Response) => {
        userGetByNumberPhoneController(req,res)
    })

router.route("/api/user/id/:id")
    .put(validateToken,async(req: Request,res: Response) => {
        userEditController(req,res)
    })
    .delete(validateToken,async(req:Request,res: Response) => {
        userDeleteController(req,res)
    })
    .get(validateToken,async(req:Request,res: Response) => {
        userGetByIdConroller(req,res)
    })

module.exports = router