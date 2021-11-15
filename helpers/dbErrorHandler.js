"use strict";
 
/**
 * Get unique error field name
 */
const uniqueMessage = error => {
    let output;

    try {        
        output =
        error
            .message
            .split(":")[3]
            .split("{")
            .pop() +
            " already exists";
    } catch (ex) {
        output = "Unique field already exists";
    }
 
    return {description:output};
};
 
/**
 * Get the erroror message from error object
 */
exports.errorHandler = error => {
    let message = "";

    if (error.code) {
        switch (error.code) {
            case 11000:                
                message = uniqueMessage(error);
                break;
            case 11001:
                
            default:
                message = "Something went wrong";
        }
    } else {
        for (let errorName in error.errorors) {
            if (error.errorors[errorName].message)
                message = error.errorors[errorName].message;
        }
    }

    return message;
};