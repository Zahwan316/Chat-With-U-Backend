import sequelize from '../config';
import { DataTypes } from 'sequelize';
import responseHandling from '../function/respondHandling';
import { HttpStatusCode } from 'axios';
import {Request,response,Response} from 'express';
import HTTPStatusCode from '../function/statuscode';

const memberGroup = require("../../models/MemberGroup")
const MemberGroup = memberGroup(sequelize,DataTypes)
const errorHandling = require("../function/errhandling")
const {v4:uuidv4} = require("uuid")

const getAllMemberGroupController = async(req: Request,res: Response) => {
    try{
        const allData = await MemberGroup.findAll()
        if(allData){
            responseHandling(HttpStatusCode.Ok,"Data berhasil diambil",res,req,false,allData)
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const addMemberGroupController = async(req: Request,res: Response) => {
    try{
        const {id,Group_id,User_id} = req.body

        if(Group_id === "" || Group_id === null || User_id === "" || User_id === null){
            responseHandling(HTTPStatusCode.BAD_REQUEST,"Group id dan User id tidak boleh kosong",res,req,true)
        }
        else{
            if(!id || id === "" || id === null){
                const addData = await MemberGroup.create({
                    ...req.body,
                    id:uuidv4()
                })
            }
            else{
                const addData = await MemberGroup.create({
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

const deleteMemberGroupController = async(req: Request,res: Response) => {
    try{
        const {id} = req.params
        const findMember = await MemberGroup.findByPk(id)
        if(findMember){
            findMember.destroy()
            responseHandling(HTTPStatusCode.OK,"Data berhasil dihapus",res,req,false)
        }
        else{
            responseHandling(HTTPStatusCode.NOT_FOUND,"Data tidak ditemukan",res,req,true)
        }

    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const getByIdMemberGroupController = async(req:Request,res: Response) => {
    try{
        const {id} = req.params
        const findMember = await MemberGroup.findByPk(id)
        if(findMember){
            responseHandling(HTTPStatusCode.OK,"Data berhasil diambil",res,req,false)
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
    getAllMemberGroupController,
    addMemberGroupController,
    deleteMemberGroupController,
    getByIdMemberGroupController
}