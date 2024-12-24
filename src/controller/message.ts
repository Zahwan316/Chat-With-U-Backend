import { Request, Response } from "express";
import sequelize from "../config";
import { DataTypes } from "sequelize";
import HTTPStatusCode from "../function/statuscode";
import { Op } from "sequelize";
import responseHandling from "../function/respondHandling";
import MemberGroup from "../types/member_group";
import GroupType from "../types/group";

const errorHandling = require("../function/errhandling")
const message = require("../../models/Message")
const Message = message(sequelize,DataTypes)
const group = require("../../models/Group")
const Group = group(sequelize,DataTypes)
const memberGroup = require("../../models/MemberGroup")
const MemberGroup = memberGroup(sequelize,DataTypes)
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
          const checkMemberGroup = await MemberGroup.findAll({where:{User_id:userfromID}})
          const memberGroupId = checkMemberGroup.map((item:MemberGroup) => item.Group_id)
          const findGroup = await Group.findAll({where:{id:{[Op.in]:memberGroupId}}})
          const GroupId = findGroup.map((item:GroupType) => item.id)
          const findAllGroupChat = await Message.findAll({where:{group_id:{[Op.in]:GroupId}}})
          const mergeChat = [...messageFromQueryUser,...findAllGroupChat]
          console.log(mergeChat)
          responseHandling(HTTPStatusCode.OK,"Data berhasil diambil",res,req,false,mergeChat)
        }
        else{
          responseHandling(HTTPStatusCode.OK,"Data berhasil diambil",res,req,false,allMessage)
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

            responseHandling(HTTPStatusCode.CREATED,"Data berhasil ditambahkan",res,req,false)
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