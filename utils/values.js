exports.MIN_PASSWORD_LENGTH = 6;
exports.MIN_RUT_LENGTH = 6;
exports.ACCEPTED_EXTENSIONS = ['JPG', 'JPEG', 'PNG'];
exports.MAX_FILE_SIZE = 10000000; //10MB


exports.ERRORS = {
    "INTERNAL_ERROR": {
        httpCode: 400,
        code: "#-1",
        description: "Internal error, please try again"
    },
    "MISSING_REQUIRED_FIELDS": {
        httpCode: 400,
        code: "#1001",
        description: "Missing required fields"
    },
    "USER_ALREADY_EXIST": {
        httpCode: 403,
        code: "#1002",
        description: "Email already exist"
    },
    "PASSWORD_TOO_SHORT": {
        httpCode: 400,
        code: "#1003",
        description: `Password is too short, should be at least ${this.MIN_PASSWORD_LENGTH} characters .`
    },
    "PASSWORD_DO_NOT_MATCH": {
        code: "#1004",
        description: "Password does not match",
        httpCode: 403
    },
    "USER_NOT_EXIST": {
        httpCode: 404,
        code: "#1005",
        description: "User does not exist"
    },
    "BAD_CREDENTIALS": {
        httpCode: 403,
        code: "#1006",
        description: "Bad credentials"
    },
    "UNSUPPORTED_EXTENSIONS": {
        httpCode: 400,
        code: "#1007",
        description: "Image must be PNG, JPG, JPEG or SVG"
    },
    "FILE_TOO_LARGE": {
        httpCode: 400,
        code: "#1008",
        description: "Max file size allowed is " + (this.MAX_FILE_SIZE / 1000000) + " MB."
    },
    "NO_TOKEN_PROVIDED": {
        httpCode: 403,
        code: "#1009",
        description: "Session lost, please Signin again."
    },
    "AUTHENTICATE_FAILED": {
        httpCode: 401,
        code: "#1010",
        description: "Authentication error, please signin."
    },
    "UNAUTHORIZED": {
        httpCode: 401,
        code: "#1011",
        description: "Unauthorized"
    },
    "ACCESS_DENIED": {
        httpCode: 403,
        code: "1012",
        description: "Access Denied"
    },
    "ORDER_NOT_EXIST": {
        httpCode: 404,
        code: "1013",
        description: "Order not found"
    },
    "ORDER_TOTAL_GREATER_ZERO": {
        httpCode: 404,
        code: "1014",
        description: "Order total must be greater than zero"
    }
}

exports.DEFAULT_ERROR = {
    httpCode: 500,
    code: "#-2",
    description: "Ha ocurrido un error inesperado, intente mas tarde."
}