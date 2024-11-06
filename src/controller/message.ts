import { Request, Response } from "express";
import sequelize from "../config";
import { DataTypes } from "sequelize";
import HTTPStatusCode from "../function/statuscode";
import { Op } from "sequelize";
import responseHandling from "../function/respondHandling";

const errorHandling = require("../function/errhandling")
const message = require("../../models/Message")
const Message = message(sequelize,DataTypes)
const {v4:uuidv4} = require("uuid")

const getAllMessageController = async(req: Request,res: Response) => {
    try{
        const allMessage = await Message.findAll({
            order:sequelize.col('created_Date')
        })
        const {userfromID,usertargetID} = req.query
        if(userfromID && usertargetID){
            const messageFromQueryUser = await Message.findAll({where:
                {
                    [Op.or]:[{user_target_id:usertargetID},{user_from_id:userfromID}],

                }
                ,
                order:sequelize.col("created_Date")

            })
            res.status(HTTPStatusCode.OK).json({
                message:"Data berhasil diambil",
                data:messageFromQueryUser,
                error:false,
                statusCode:HTTPStatusCode.OK
            })
        }
        else{
            res.status(HTTPStatusCode.OK).json({
                message:"Data berhasil diambil",
                data:allMessage,
                error:false,
                statusCode:HTTPStatusCode.OK
            })
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const addMessageController = async(req:Request,res: Response) => {
    try{
        const {body,group_id,user_target_id,time,type,user_from_id} = req.body

        if(!body || body === ""){
            res.status(HTTPStatusCode.BAD_REQUEST).json({
                message:"Body tidak boleh kosong",
                error:true,
                method:req.method,
                statusCode:HTTPStatusCode.BAD_REQUEST
            })
        }
        else{
            const addMessage = await Message.create({
                ...req.body,
                id:uuidv4(),
            })

            res.status(HTTPStatusCode.CREATED).json({
                message:"Data berhasil ditambahkan",
                error:false,
                method:req.method,
                statusCode:HTTPStatusCode.CREATED
            })
        }

    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const getSpecificMessage = async(req: Request,res: Response) => {
    try{

    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const getGroupMessageController = async(req:Request,res:Response) => {
    try{
        const {group_id} = req.params
        const findMessage = await Message.findAll({where:{group_id}})
        if(findMessage){
            responseHandling(HTTPStatusCode.OK,"Data berhasil diambil",res,req,false,findMessage)
        } 
        else{
            responseHandling(HTTPStatusCode.NOT_FOUND,"Data tidak ditemukan",res,req,true)
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

module.exports = {
    getAllMessageController,
    addMessageController,
    getSpecificMessage,
    getGroupMessageController
}