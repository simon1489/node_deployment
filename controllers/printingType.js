const PrintingType = require('../models/printingType');
const {errorHandler} = require('../helpers/dbErrorHandler');

//LIST PRINTING TYPES
exports.list = (req, res) => {
    PrintingType.find().exec((err, printingTypes) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(printingTypes);
    });
};

//CREATE PRINTING TYPE
exports.create = (req, res) => {

    const {name} = req.body;

    if (!name) {
        return errorResponse(res, 'MISSING_REQUIRED_FIELDS');
    }

    const printingType = new PrintingType(req.body);

    printingType.save((err,data) => {
        if(err){
            console.log(err);
            res.status(400).json({
                error : errorHandler(err)
            });
        }else{
            console.log("Printing Type created", data);
            res.status(201).json(data);
        }
    });
}