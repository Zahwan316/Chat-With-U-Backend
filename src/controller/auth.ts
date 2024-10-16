import { Request, Response } from "express"
import dotenv from "dotenv"
import sequelize from "../config"
import { DataType, DataTypes } from "sequelize"
import bcrypt from 'bcrypt';
import { HttpStatusCode } from "axios";
import HTTPStatusCode from "../function/statuscode";
import jwt, { JwtPayload } from "jsonwebtoken"


const errorHandling = require("../function/errhandling")
const secret_key = process.env.JWT_SECRET_KEY as string
const user = require("../../models/User")
const User = user(sequelize,DataTypes)
const {v4:uuidv4} = require("uuid")

dotenv.config()

type payload = {
    id:string,
    username: string,
    email: string,
    iat: number,
    exp: number
}

const LoginController = async(req: Request,res: Response) => {
    try{
        const {email,password} = req.body
        const findUser = await User.findOne({
            where:{
                email
            }
        })

        if(!findUser){
            res.status(HTTPStatusCode.NOT_FOUND).json({
                message:"Akun tidak ditemukan",
                method:req.method,
                error: true,
                statusCode: HTTPStatusCode.NOT_FOUND
            })
        }
        else{
            const isValidPassword = bcrypt.compare(password,findUser.password)
    
            if(!isValidPassword){
                res.status(HTTPStatusCode.BAD_REQUEST).json({
                    message:"Password atau email salah",
                    method:req.method,
                    error: true,
                    statusCode: HTTPStatusCode.BAD_REQUEST
                })
            }
            else{
                const token = jwt.sign({id:findUser.id,username:findUser.username,email:findUser.email},secret_key,{expiresIn:86400})
        
                res.status(HttpStatusCode.Ok).json({
                    message:"Login berhasil",
                    error: false,
                    method:req.method,
                    token,
                    statusCode:HttpStatusCode.Ok
                })
    
            }
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

const RegisterController = async(req: Request,res: Response) => {
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
        errorHandling(req,res,e)
    }
}

const getUserToken = async(req: Request,res: Response) => {
    try{
        const token = req.headers.authorization && req.headers.authorization.match(/^Bearer (.*)$/)
        if(token && token[1]){
            jwt.verify(token[1],secret_key,async(e,decoded) => {
                if(e){
                    res.status(HttpStatusCode.BadRequest).json({
                        error:true,
                        message:e,
                        method:req.method,
                        statusCode:HttpStatusCode.BadRequest
                    })
                }
                else{
                    let data = decoded as JwtPayload
                    if(data){
                        const userid = data.id
                        const findUser = await User.findByPk(userid)
                        if(findUser){
                            res.status(HttpStatusCode.Ok).json({
                                message:"Data berhasil diambil",
                                data:findUser,
                                method:req.method,
                                statusCode:HttpStatusCode.Ok,
                                error:false,
                            })
                        }
                    }
                }
            })
        }
        else{
            res.status(HttpStatusCode.BadRequest).json({
                message:"Invalid Token",
                method:req.method,
                statusCode:HttpStatusCode.BadRequest,
                error:true,
            })
        }
    }
    catch(e){
        errorHandling(req,res,e)
    }
}

module.exports = {
    LoginController,
    RegisterController,
    getUserToken
}