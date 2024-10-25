import { Request, Response } from "express"
import sequelize from "../config"
import { DataTypes } from "sequelize"
import { HttpStatusCode } from "axios"


const errorHandling = require("../function/errhandling")
const status = require("../../models/status")
const Status = status(sequelize,DataTypes)


const getStatusController = async(req:Request,res: Response) => {
    try{
        const status = await Status.findAll()
        if(status){
            res.status(HttpStatusCode.Ok).json({
                message:"Data berhasil diambil",
                data:status,
                method:req.method,
                statusCode:HttpStatusCode.Ok,
                error:false,
            })
        }
    }
    catch(e){
        errorHandling(req,res,e)        
    }
}

module.exports = {
    getStatusController
}