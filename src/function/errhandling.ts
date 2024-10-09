import { error } from "console"
import { Request, Response } from "express"
import HTTPStatusCode from "./statuscode"

type errorParams = (req:Request,res: Response,e: unknown) => void

const errorHandling: errorParams = (req:Request,res:Response,e: unknown):void => {
    const message: string = e instanceof Error ? e.message : "Server error"
    res.status(HTTPStatusCode.SERVER_ERROR).json({
        message:message,
        method:req.method,
        error:true,
        statusCode:HTTPStatusCode.SERVER_ERROR
    })
}

module.exports = errorHandling