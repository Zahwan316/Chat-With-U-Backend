import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import sequelize from "../config";
import { DataTypes } from "sequelize";
import dotenv from "dotenv"

const user = require("../../models/User")
const User = user(sequelize,DataTypes)
const secret_key = process.env.JWT_SECRET_KEY as string

const validateToken = (req: Request,res: Response,next:NextFunction) => {
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
                        next()
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

export default validateToken