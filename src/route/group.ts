import express,{Express,Response,Request} from 'express';
import validateToken from '../middleware/validateToken';

const app:Express = express()
const router = express.Router()

const {
    getGroupController,
    addGroupController,
    editGroupController,
    deleteGroupController,
    getGroupByIdController,
} = require("../controller/group")

router.route("/api/group")
    .get(validateToken,async(req:Request,res:Response) => {
        getGroupController(req,res)
    })
    .post(validateToken,async(req:Request,res:Response) => {
        addGroupController(req,res)
    })
    
router.route("/api/group/id/:id")
    .put(validateToken,async(req:Request,res:Response) => {
        editGroupController(req,res)
    })
    .delete(validateToken,async(req:Request,res:Response) => {
        deleteGroupController(req,res)
    })
    .get(validateToken,async(req:Request,res:Response) => {
        getGroupByIdController(req,res)
    })


module.exports = router