import { DataTypes } from "sequelize"
import sequelize from "../config"
import responseHandling from "../function/respondHandling"
import { HttpStatusCode } from "axios"
import { Request , Response} from 'express';
import HTTPStatusCode from "../function/statuscode";

const group = require("../../models/Group")
const Group = group(sequelize,DataTypes)
const memberGroup = require("../../models/MemberGroup")
const MemberGroup = memberGroup(sequelize,DataTypes)
const errorHandling = require("../function/errhandling")
const {v4:uuidv4} = require("uuid")

const getGroupController = async(req:Request,res: Response) => {
    try{
        const getData = await Group.findAll()

        if(getData){
            responseHandling(HttpStatusCode.Ok,"Data berhasil diambil",res,req,false,getData)
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const addGroupController = async(req: Request, res: Response) => {
    try{
        const {id,admin_user_id} = req.body
        if(!admin_user_id){
            responseHandling(HTTPStatusCode.BAD_REQUEST,"Admin user id tidak boleh kosong",res,req,true)
        }
        else{
            if(!id || id === "" || id === null){
                const addData = await Group.create({
                    ...req.body,
                    id:uuidv4()
                })
            }
            else{
                const addData = await Group.create({
                    ...req.body,
                })
            }
            responseHandling(HTTPStatusCode.CREATED,"Data berhasil ditambahkan",res,req,false)
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const editGroupController = async(req: Request,res: Response) => {
    try{
        const {id} = req.params
        const findGroup = await Group.findByPk(id)
        if(findGroup){
            const update = await findGroup.update({
                ...req.body
            })
            responseHandling(HTTPStatusCode.OK,"Data berhasil diedit",res,req,false)
        }
        else{
            responseHandling(HTTPStatusCode.NOT_FOUND,"Data tidak ditemukan",res,req,true)
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const deleteGroupController = async(req:Request,res: Response) => {
    try{
        const {id} = req.params
        const findGroup = await Group.findByPk(id)
        if(findGroup){
            MemberGroup.destroy({where:{Group_id:findGroup?.id}})
            findGroup.destroy()
            responseHandling(HTTPStatusCode.OK,"Data berhasil dihapus",res,req,false)
        }
        else[
            responseHandling(HTTPStatusCode.NOT_FOUND,"Data tidak ditemukan",res,req,true)
        ]
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const getGroupByIdController = async(req: Request,res: Response) => {
    try{
        const {id} = req.params
        const findGroup = await Group.findByPk(id)
        if(findGroup){
            responseHandling(HTTPStatusCode.OK,"Data berhasil diambil",res,req,false,findGroup)
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
    getGroupController,
    addGroupController,
    editGroupController,
    deleteGroupController,
    getGroupByIdController
}