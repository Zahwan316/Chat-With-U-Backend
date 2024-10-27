import { Request, Response } from "express"

const responseHandling = (statusCode: number,message: string,res: Response,req: Request,error: boolean,data?:any): void => {
    res.status(statusCode).json({
        message,
        data,
        statusCode,
        method:req.method,
        error
    })
}

export default responseHandling