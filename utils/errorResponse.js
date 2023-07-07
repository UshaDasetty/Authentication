// Blueprint of Error response(message)
class ErrorResponse extends Error {
    constructor(message,statusCode) {
        super(message,statusCode);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;