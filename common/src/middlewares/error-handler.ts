import { Request, Response, NextFunction } from "express"
import { CustomError } from "../errors/CustomError";
// error middleware handler

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    // common response structure

    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({
            errors: err.serializeErrors()
        });
    }

    console.log(err); 

    res.status(400).send({
        errors: [
            { message: 'Something went wrong!'}
        ]
    });
}