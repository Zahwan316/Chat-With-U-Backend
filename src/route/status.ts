import express,{Express,Request,Response} from "express"
import validateToken from '../middleware/validateToken';

const router = express.Router()
const {getStatusController,addStatusController,deleteStatusController} = require("../controller/status")

router.route("/api/status")
    .get(validateToken,async(req: Request,res: Response) => {
        getStatusController(req,res)
    })
    .post(validateToken,async(req: Request,res: Response) => {
        addStatusController(req,res)
    })

router.route("/api/status/id/:id")
    .delete(validateToken,async(req: Request,res: Response) => {
        deleteStatusController(req,res)
    })

module.exports = router