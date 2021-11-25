const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const {errorResponse} = require('../utils');
const {MAX_FILE_SIZE} = require('../utils/values');
const Product = require('../models/product');
const ProductView = require('../models/productView');
const {errorHandler} = require('../helpers/dbErrorHandler');

//Middleware for get product by product id
exports.productById = (req, res, next, id) => {
    console.log('pase por findByOne id:', id);
    Product.findById(id)
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: 'Product not found'
                });
            }
            req.product = product;
            next();
        });
};

exports.productByIdWithViews = (req, res, next, id) => {
    Product.findById(id)
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: 'Product not found'
                });
            }
            req.product = product;      
           
            if (!req.product){
                next();
            }

            ProductView.find({product : product})
                .select()
                .exec((err, productViews) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Product views not found'
                        });
                    }
                    req.views = productViews;
                    next();
                });

        });        
};

//CREATE PRODUCT
exports.create = (req, res) => {
    let form =  new formidable.IncomingForm();
    form.uploadDir="images/products";
    form.keepExtensions = true;
    form.parse(req, (err,fields,files) => {

        if(err){
            return res.status(400).json({
                error : 'Error on recieved data'
            });
        }
        
        const { name, descr, category, price, qty, weight } = fields;

        if (!name || !descr || !category) {
            return errorResponse(res, 'MISSING_REQUIRED_FIELDS');
        }
        
        if (fields.colorList !== undefined)
        {
            fields.colorList = JSON.parse(fields.colorList);
        }

        if (fields.sizeList !== undefined)
        {
            fields.sizeList = JSON.parse(fields.sizeList);
        }
        
        let product = new Product(fields);

        if(files.image){  
            const imageType = files.image.type.split('/').pop();  
            const acceptedImageTypes = ["png", "jpg", "jpeg", "svg"];
            const imageURL = `images/products/${product._id}.${imageType}`;

            if (files.image.size > MAX_FILE_SIZE) {
                return errorResponse(res, 'FILE_TOO_LARGE');
            }

            if (!acceptedImageTypes.includes(imageType)) {
                return errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
            }       
            
            fs.rename(files.image.path, imageURL, (error) => {
                if(error){
                    console.log(error);
                }              
            });  

            product.imageURL = imageURL;
            product.imageType = imageType;          
        }

        product.save((err,data) => {
            if(err){
                return res.status(400).json({
                    error : errorHandler(err)
                });
            }            
       
            res.status(201).json(data);            
        });
    });
}

//READ PRODUCT
exports.read = (req, res) => {
    return res.json(req.product);
};

//UPDATE PRODUCT
exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let product = req.product;

        fields.colorList = JSON.parse(fields.colorList);
        fields.sizeList = JSON.parse(fields.sizeList);
        product = _.extend(product, fields);

        if(files.image){  
            const imageType = files.image.type.split('/').pop();  
            const acceptedImageTypes = ["png", "jpg", "jpeg", "svg"];
            const imageURL = `images/products/${product._id}.${imageType}`;

            if (files.image.size > MAX_FILE_SIZE) {
                return errorResponse(res, 'FILE_TOO_LARGE');
            }

            if (!acceptedImageTypes.includes(imageType)) {
                return errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
            }       
            
            fs.rename(files.image.path, imageURL, (error) => {
                if(error){
                    console.log(error);
                }              
            });  

            product.imageURL = imageURL;
            product.imageType = imageType;          
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

//DELETE PRODUCT
exports.remove = (req, res) => {
    let product = req.product;
    const imageURL = product.imageURL;

    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }        

        if(imageURL){
            fs.unlink(imageURL, (error) => {
                if(error){ console.log(error); }
            });
        }

        ProductView.remove({product : product}, function(err) {console.log(err)})

        res.json({
            message: 'Product deleted successfully'
        });
    });
};

//LIST PRODUCTS
exports.list = (req, res) => {

    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const queryFilter = req.query.printingType ? {printingType : req.query.printingType} : {};

    Product.find(queryFilter)
    .select()
    .populate({path:'category',select:'_id name printingType', populate:{path:'printingType'}})
    .populate({path:'mainView', select:'_id imageBaseURL imageShadowsURL imageHighlightsURL'})
    .sort([[sortBy, order]])
    .exec((err, products) => {

        if (err)
        {
            return res.status(400).json({
                error: 'Products not found'
            });
        }
        
        res.json(products);
    });
};

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }
        next();
    });
};
