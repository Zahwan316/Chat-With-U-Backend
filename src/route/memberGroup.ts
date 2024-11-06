import express,{Express,Response,Request} from 'express';
import validateToken from '../middleware/validateToken';

const app:Express = express()
const router = express.Router()
const {
    getAllMemberGroupController,
    addMemberGroupController,
    deleteMemberGroupController,
    getByIdMemberGroupController,
    getMemberGroupUserIdController
} = require("../controller/memberGroup")

router.route("/api/memberGroup")
    .get(validateToken,(req: Request,res: Response) => {
        getAllMemberGroupController(req,res)
    })
    .post(validateToken,(req:Request,res: Response) => {
        addMemberGroupController(req,res)
    })

router.route("/api/memberGroup/id/:id")
    .delete(validateToken,(req:Request,res:Response) => {
        deleteMemberGroupController(req,res)
    })
    .get(validateToken,(req:Request,res:Response) => {
        getByIdMemberGroupController(req,res)
    })

router.route("/api/memberGroup/userId/:userId")
    .get(validateToken,(req:Request,res: Response) => {
        getMemberGroupUserIdController(req,res)
    })

module.exports = router