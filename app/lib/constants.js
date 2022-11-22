const statusCode = {
    "success": 200,
    "notFound": 404,
    "error": 401,
    "warning": 404,
    "failed": 1002,
    "unauth": 402,
    "internalError": 1004,
    "failedConnection": 500,
    "okList": 201,
    "alreadyCreated": 208,
    "badRequest": 400,
    "passExpired": 532,
    "samePass": 406,
    "unVerified": 206
}

const messages = {
    "success": "Success",
    "UserExist": "User Already Exists",
    "norecordforid": "No Record Found For id ",
    "notfound": "No Record Found",
    "internalerror": 'Internal Server Errorr',
    "DELETED": "Record has been Deleted",
    "UPDATED": "Record has been Updated",
    "DATAMISSING": "Sorry some data is missing,please check",
}

const emailKeyword = {
    "user_registration": "user_registration",
}

const expirationDuration = {
    "expiry": 60 * 60 * 8 * 1,
    "mailTokenExpirationTime": 60 * 60 * 24 * 1
}
var obj = {
    statusCode: statusCode,
    emailKeyword: emailKeyword,
    expirationDuration: expirationDuration,
    messages:messages,
    SUCCESS_CODE: 200,
    ALLREADY_EXIST: 409,
    CREATED: 201,
    ERROR_CODE: 400,
    AUTH_CODE: 401,
    SERVICE_UNAVAILABLE: 503,
    NO_CONTENT: 204,
    PAGE_COUNT: 10,
    INVAILID_EMAIL: "Email does not exist! ",
    SOMETHING_WENT_WRONG: 'Something went wrong',
    PROFILE_PIC_UPDATE: 'Your profile picture updated successfully.',
    IMAGE_FORMAT_ERROR: 'Please upload proper image.',
    USER_NAME_CHANGE: "User Details change Successfully"
};

module.exports = obj;
