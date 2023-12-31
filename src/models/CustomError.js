export class CustomError {
    constructor() { }
    static createError({ name = "Error", cause, message, code = 1 }) {
        const error = new Error(message)
        error.cause = cause
        error.name = name
        error.code = code
        throw error
    }
}

export const ErrorCodes = {
    ROUTING_ERROR: 1,
    INVALID_TYPES_ERROR:2,
    DATABASE_ERROR:3,
    AUTHENTICATION_ERROR:4,
    VALIDATION_ERROR:5,
    NOT_FOUND_ERROR: 6,
    INTERNAL_ERROR: 7,
    PASSWORDS_DO_NOT_MATCH: 8,
    USER_NOT_EXIST: 9,
}