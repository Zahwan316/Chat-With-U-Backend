import { Request, Response } from "express";
import sequelize from "../config"
import { DataTypes } from "sequelize";
import HTTPStatusCode from "../function/statuscode"
import bcrypt from "bcrypt"
import { HttpStatusCode } from "axios";
import UserType from "../types/user";
import MessageType from "../types/message";



const errorHandling = require("../function/errhandling")
const user = require("../../models/User")
const User = user(sequelize,DataTypes)
const {v4:uuidv4} = require("uuid")
const message = require("../../models/Message")
const Message = message(sequelize,DataTypes)

type errorReturn = {
    message: string,
    method: string,
    error: boolean
}

type RequestBody = {
    fullname: string,
    username: string,
    number_phone: number,
    email: string,
    bio: string,
    image: string,
}

const userGetController = async(req: Request,res: Response):Promise<void> => {
    try{
        const getUser = await User.findAll({attributes:{exclude:['password']}})
        
        res.status(HTTPStatusCode.OK).json({
            message:"Data berhasil diambil",
            error:false,
            data:getUser,
            statuscode:HTTPStatusCode.OK,
            method:req.method
        })
        
    }
    catch(e:unknown){
        const message: string = e instanceof Error ? e.message : "Server error"
        res.status(HTTPStatusCode.SERVER_ERROR).json({
            message:message,
            method:req.method,
            error:true,
            statusCode:HTTPStatusCode.SERVER_ERROR
        })
    }
}

const userAddController = async(req: Request,res: Response) => {
    try{
        type requiredbody = {
            username:string,
            fullname:string,
            password:string
        }
        const {username,fullname,password,number_phone,email,bio,image} = req.body

        const requiredBody: requiredbody = {username,fullname,password}

        for(const key in requiredBody){
            const bodykey = key as keyof requiredbody
            if(requiredBody[bodykey] === "" || requiredBody[bodykey] === null){
                res.status(HTTPStatusCode.BAD_REQUEST).json({
                    message:"Username,fullname,dan password tidak boleh kosong",
                    error:true,
                    statusCode:HTTPStatusCode.BAD_REQUEST,
                    method:req.method
                })
                break;
            }
        }
        
        const passwordHash = req.body.password && await bcrypt.hash(password,10)
        const sameUser = await User.findOne({where:{
            username,
            fullname,
            email
        }})
        if(sameUser){
            res.status(HTTPStatusCode.BAD_REQUEST).json({
                message:"Akun sudah ada",
                error:true,
                statusCode:HTTPStatusCode.BAD_REQUEST,
                method:req.method
            })
        }
        else{
            const createUser = await User.create({
                ...req.body,
                image:"/",
                id:uuidv4(),
                password:passwordHash
            })
            res.status(HTTPStatusCode.CREATED).json({
                message:"Akun berhasil dibuat",
                statusCode: HTTPStatusCode.CREATED,
                error: false,
                method: req.method
            })
        }
    }
    catch(e){
        const message: string = e instanceof Error ? e.message : "Server error"
        res.status(HTTPStatusCode.SERVER_ERROR).json({
            message:message,
            method:req.method,
            error:true,
            statusCode:HTTPStatusCode.SERVER_ERROR
        })
    }
}

const userGetByNumberPhoneController = async(req: Request,res: Response) => {
    try{
        const {no_telepon} = req.params
        const getUser = await User.findAll({attributes:{exclude:['password']},where:{number_phone:no_telepon}})
        
            res.status(HTTPStatusCode.OK).json({
                message:"Data berhasil diambil",
                error:false,
                data:getUser,
                statuscode:HTTPStatusCode.OK,
                method:req.method
            })
        
    }
    catch(e:unknown){
        const message: string = e instanceof Error ? e.message : "Server error"
        res.status(HTTPStatusCode.SERVER_ERROR).json({
            message:message,
            method:req.method,
            error:true,
            statusCode:HTTPStatusCode.SERVER_ERROR
        })
    }
}

const userEditController = async(req: Request,res: Response ) => {
    try{
        const id: string = req.params?.id
        const searchUser = await User.findByPk(id)
        if(searchUser){
            const updatedUser = await searchUser.update({
                ...req.body,
            })
            res.status(HttpStatusCode.Ok).json({
                message:"Data berhasil diperbarui",
                error:false,
                method:req.method,
                statusCode:HttpStatusCode.Ok
            })
        }
        else{
            res.status(HttpStatusCode.NotFound).json({
                message:"Data tidak ditemukan",
                error:true,
                method:req.method,
                statusCode:HttpStatusCode.NotFound
            })
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const userDeleteController = async(req: Request,res: Response) => {
    try{
        const id: string = req.params?.id
        const findUser = await User.findByPk(id)
        //const message = await Message.findAll({where:{user_from_id:findUser?.id}})
        //console.log(message)
        if(findUser){
            Message.destroy({where:{user_from_id:findUser?.id}})
            findUser.destroy()
            res.status(HttpStatusCode.Ok).json({
                message:"Data berhasil dihapus",
                method:req.method,
                statusCode:HttpStatusCode.Ok,
                error:false,
            })
        }else{
            res.status(HttpStatusCode.InternalServerError).json({
                message:"Data gagal dihapus",
                method:req.method,
                statusCode:HttpStatusCode.InternalServerError,
                error:true,
        })
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const userGetByIdConroller = async(req: Request,res: Response) => {
    try{
        const id: string = req.params?.id
        const findUser: UserType = await User.findByPk(id)
        if(findUser){
            res.status(HttpStatusCode.Ok).json({
                message:"Data berhasil diambil",
                data: findUser,
                error:false,
                method:req.method
            })
        }
        else{
            res.status(HTTPStatusCode.NOT_FOUND).json({
                message:"Data tidak ditemukan",
                error:false,
                method:req.method,
                statusCode:HttpStatusCode.NotFound
            })
        }
    }
    catch(e){
        errorHandling(req,res,e)

    }
}

module.exports = {
    userGetController,
    userAddController,
    userGetByNumberPhoneController,
    userEditController,
    userDeleteController,
    userGetByIdConroller,
}