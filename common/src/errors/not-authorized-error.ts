import { CustomError } from "./CustomError";

export class NotAuthorizedError extends CustomError {
    statusCode = 401;

    constructor () {
        super('Not authorized');
        // Due to extending built in class
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors (){
        return (
            [ { message: 'Not authorized' } ]
        );
    }
}