import { CustomError } from "./CustomError";

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor () {
        super('Page not found!');
        // Due to extending built in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors (){
        return (
            [ { message: 'Page not found!' } ]
        );
    }
}