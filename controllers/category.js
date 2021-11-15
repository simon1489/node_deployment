const Category = require('../models/category');
const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');
const {errorResponse} = require('../utils');

//Get category by ID
exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: 'Category does not exist'
            });
        }
        req.category = category;
        next();
    });
};

//CREATE CATEGORY
exports.create = (req, res) => {

    const {name} = req.body;

    for (const key in req.body) {
        if (key == 'name' && !req.body[key]) {
            return errorResponse(res, 'MISSING_REQUIRED_FIELDS',key);
        }        

        if (key == 'printingType' && (!req.body[key] || req.body[key] === "0")) {
            return errorResponse(res, 'MISSING_REQUIRED_FIELDS',key);
        }     
    }

    const category = new Category(req.body);

    category.save((err,data) => {
        if(err){
            console.log(err);
            res.status(400).json({
                error : errorHandler(err)
            });
        }else{
            res.status(201).json(data);
        }
    });
}

//READ CATEGORY
exports.read = (req, res) => {
    return res.json(req.category);
};

//UPDATE CATEGORY
exports.update = (req, res) => {
    console.log('req.body', req.body);
    console.log('category update param', req.params.categoryId);

    const category = req.category;
    if(req.body.name){
        category.name = req.body.name;
    }

    if(req.body.descr){
        category.descr = req.body.descr;
    }

    /*if(req.body.FPD_id){
        category.FPD_id = req.body.FPD_id;
    }*/
    
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

//DELETE CATEGORY
exports.remove = (req, res) => {
    const category = req.category;
    Product.find({ category }).exec((err, products) => {
        if (products.length >= 1) {
            return res.status(400).json({
                error:{
                    description: `You can't delete ${category.name} category. It has ${products.length} associated product(s).`
                }              
            });            
        } else {
            category.remove((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({
                    message: 'Category deleted'
                });
            });
        }
    });
};

//LIST CATEGORIES
exports.list = (req, res) => {
    const queryFilter = req.query.printingType ? {printingType : req.query.printingType}  : {};
    Category.find(queryFilter)
        .populate('printingType', '_id name')
        .exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(categories);
    });
};