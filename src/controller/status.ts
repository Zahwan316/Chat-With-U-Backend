import { Request, response, Response } from "express"
import sequelize from "../config"
import { DataTypes } from "sequelize"
import { HttpStatusCode } from "axios"
import { uuid } from "uuidv4"
import responseHandling from "../function/respondHandling"
import HTTPStatusCode from "../function/statuscode"

const errorHandling = require("../function/errhandling")
const status = require("../../models/status")
const Status = status(sequelize,DataTypes)
const user = require("../../models/user")
const User = user(sequelize,DataTypes)
const {v4:uuidv4} = require("uuid")


const getStatusController = async(req:Request,res: Response) => {
    try{
        const status = await Status.findAll()
        if(status){
            responseHandling(HttpStatusCode.Ok,"Data berhasil diambil",res,req,false,status)
        }
    }
    catch(e){
        errorHandling(req,res,e)        
    }
}

const addStatusController = async(req:Request,res: Response) => {
    try{
        const { user_id } = req.body

        if(user_id === "" || !user_id){
            responseHandling(HttpStatusCode.BadRequest,"User id tidak boleh kosong",res,req,true,)
        }
        else{
            const findUser = await User.findByPk(user_id)
            if(!findUser){
                responseHandling(HTTPStatusCode.BAD_REQUEST,"User yang upload status tidak ditemukan",res,req,true)
            }
            else{
                const oneMinuteLater = new Date()
                oneMinuteLater.setMinutes(oneMinuteLater.getMinutes() + 1)
                const createStatus = await Status.create({
                    ...req.body,
                    id:uuidv4(),
                    expired_at: oneMinuteLater.toISOString()
                })
    
                responseHandling(HttpStatusCode.Created,"Data berhasil ditambahkan",res,req,false)
            }
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const deleteStatusController = async(req:Request,res: Response) => {
    try{
        const id = req.params
        const findStatus = await Status.findByPk(id)
        if(findStatus){
            await findStatus.destroy()
            responseHandling(HttpStatusCode.Ok,"Data berhasil dihapus",res,req,false)
        }
        else{
            responseHandling(HttpStatusCode.NotFound,"Data tidak ditemukan",res,req,true)
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

module.exports = {
    getStatusController,
    addStatusController,
    deleteStatusController
}