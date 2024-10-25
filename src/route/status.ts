import express,{Express,Request,Response} from "express"

const router = express.Router()
const {getStatusController} = require("../controller/status")

router.route("/api/status")
    .get(async(req: Request,res: Response) => {
        getStatusController(req,res)
    })
    .post(async(req: Request,res: Response) => {

    })

router.route("/api/status/id/:id")
    .delete(async(req: Request,res: Response) => {

    })

module.exports = router