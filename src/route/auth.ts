import express,{Express,Response,Request} from "express"

const app: Express = express()
const router = express.Router()
const {LoginController,getUserToken,RegisterController} = require("../controller/auth")

router.route("/auth/login")
    .post(async(req,res) => {
        LoginController(req,res)
    })

router.route("/auth/register")
    .post(async(req,res) => {
        RegisterController(req,res)
    })

router.route("/auth/user")
    .get(async(req,res) => {
        getUserToken(req,res)
    })
module.exports = router
