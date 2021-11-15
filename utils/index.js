const  {ERRORS,DEFAULT_ERROR} = require('./values');

exports.okResponse = (res, httpCode, response) => {
    return res.status(httpCode).json({
        success: true,
        response: response
    });
}

exports.errorResponse = (res, id, extra) => {
    let error = ERRORS[id];
    error = error ? error : DEFAULT_ERROR;
    error.description = extra && extra.message ? extra.message : error.description;
    return res.status(error.httpCode).json({
        error: {
            id: id,
            code: error.code,
            description: error.description,
            extra: extra
        }
    });
}
