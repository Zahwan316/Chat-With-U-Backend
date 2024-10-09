import { Request, Response } from "express";
import sequelize from "../config"
import { DataTypes } from "sequelize";
import HTTPStatusCode from "../function/statuscode"
import bcrypt from "bcrypt"

const user = require("../../models/User")
const User = user(sequelize,DataTypes)
const {v4:uuidv4} = require("uuid")

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

module.exports = {
    userGetController,
    userAddController,
    userGetByNumberPhoneController,
}