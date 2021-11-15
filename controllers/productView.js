const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const {errorResponse} = require('../utils');
const {MAX_FILE_SIZE} = require('../utils/values');
const ProductView = require('../models/productView');
const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');

//Middleware for get productView by productView id
exports.productViewById = (req, res, next, id) => {

    ProductView.findById(id)
    .exec((err, ProductView) => {

        if (err || !ProductView)
        {
            return res.status(400).json({
                error: 'Product view not found'
            });
        }
        
        req.productView = ProductView;
        next();
    });
};

//CREATE PRODUCT
exports.create = (req, res) => {

    let form =  new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err,fields,files) => {

        if (err)
        {
            console.log(err);

            return res.status(400).json({
                error : 'Error on recieved data'
            });
        }      
         
        const acceptedImageTypes = ["png", "jpg", "jpeg", "svg"];
        const { name, product, mainView } = fields;

        if (!name || !product)
        {
            return errorResponse(res, 'MISSING_REQUIRED_FIELDS');
        }

        let forceMainView = false;

        let atLeastOneProdView = await ProductView.findOne({ product: product });

        if (!atLeastOneProdView)
        {
            forceMainView = true;
        }

        delete fields["mainView"];

        let productView = new ProductView(fields);

        if (files.image)
        {
            const imageType = files.image.type.split('/').pop();  
            const imageURL = `images/views/${productView._id}.${imageType}`;

            if (files.image.size > MAX_FILE_SIZE)
            {
                return errorResponse(res, 'FILE_TOO_LARGE');
            }

            if (!acceptedImageTypes.includes(imageType))
            {
                return errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
            }       
            
            fs.rename(files.image.path, imageURL, (error) => {

                if (error)
                {
                    console.log(error);
                }              
            });  

            productView.imageURL = imageURL;         
        }

        if (files.imageBase)
        {
            const imageType = files.imageBase.type.split('/').pop();              
            const imageURL = `images/views/${productView._id}.base.${imageType}`;

            if (files.imageBase.size > MAX_FILE_SIZE)
            {
                return errorResponse(res, 'FILE_TOO_LARGE');
            }

            if (!acceptedImageTypes.includes(imageType))
            {
                return errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
            }       
            
            fs.rename(files.imageBase.path, imageURL, (error) => {

                if (error)
                {
                    console.log(error);
                }              
            });  

            productView.imageBaseURL = imageURL;      
        }

        if (files.imageShadows)
        {
            const imageType = files.imageShadows.type.split('/').pop();              
            const imageURL = `images/views/${productView._id}.shadows.${imageType}`;

            if (files.imageShadows.size > MAX_FILE_SIZE)
            {
                return errorResponse(res, 'FILE_TOO_LARGE');
            }

            if (!acceptedImageTypes.includes(imageType))
            {
                return errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
            }       
            
            fs.rename(files.imageShadows.path, imageURL, (error) => {

                if (error)
                {
                    console.log(error);
                }              
            });  

            productView.imageShadowsURL = imageURL;   
        }

        if (files.imageHighlights)
        {
            const imageType = files.imageHighlights.type.split('/').pop();              
            const imageURL = `images/views/${productView._id}.highlights.${imageType}`;

            if (files.imageHighlights.size > MAX_FILE_SIZE)
            {
                return errorResponse(res, 'FILE_TOO_LARGE');
            }

            if (!acceptedImageTypes.includes(imageType))
            {
                return errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
            }       
            
            fs.rename(files.imageHighlights.path, imageURL, (error) => {

                if (error)
                {
                    console.log(error);
                }              
            });  

            productView.imageHighlightsURL = imageURL;   
        }

        productView.save((err, result) => {

            if (err)
            {
                return res.status(400).json({
                    error : errorHandler(err)
                });
            }

            if (mainView || forceMainView)
            {
                Product.findById(product)
                .exec((err, product) => {
                    
                    if (err || !product)
                    {
                        return res.status(400).json({
                            error: 'Product not found'
                        });
                    }

                    product.mainView = result;

                    product.save((err) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler(err)
                            });
                        }
                    });
                });
            }
            
            res.status(201).json(result);
        });
    });
}
 
//READ PRODUCT VIEW
exports.read = (req, res) => {
    /*Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: 'Category does not exist'
            });
        }
        req.category = category;
        next();
    });*/
};

//UPDATE PRODUCT VIEW
exports.update = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    const acceptedImageTypes = ["png", "jpg", "jpeg", "svg"];

    form.parse(req, (err, fields, files) => {

        if (err)
        {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let productView = req.productView;
        const { name, product, mainView } = fields;

        if (name && name === "")
        {
            return errorResponse(res, 'MISSING_REQUIRED_FIELDS');
        }

        delete fields["mainView"];
        productView = _.extend(productView, fields);

        if (files.image)
        {
            const imageType = files.image.type.split('/').pop();  
            const imageURL = `images/views/${productView._id}.${imageType}`;

            if (files.image.size > MAX_FILE_SIZE)
            {
                return errorResponse(res, 'FILE_TOO_LARGE');
            }

            if (!acceptedImageTypes.includes(imageType))
            {
                return errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
            }       
            
            fs.rename(files.image.path, imageURL, (error) => {

                if (error)
                {
                    console.log(error);
                }              
            });  

            productView.imageURL = imageURL;         
        }

        if (files.imageBase)
        {
            const imageType = files.imageBase.type.split('/').pop();              
            const imageURL = `images/views/${productView._id}.base.${imageType}`;

            if (files.imageBase.size > MAX_FILE_SIZE)
            {
                return errorResponse(res, 'FILE_TOO_LARGE');
            }

            if (!acceptedImageTypes.includes(imageType))
            {
                return errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
            }       
            
            fs.rename(files.imageBase.path, imageURL, (error) => {

                if (error)
                {
                    console.log(error);
                }              
            });  

            productView.imageBaseURL = imageURL;      
        }

        if (files.imageShadows)
        {  
            const imageType = files.imageShadows.type.split('/').pop();              
            const imageURL = `images/views/${productView._id}.shadows.${imageType}`;

            if (files.imageShadows.size > MAX_FILE_SIZE)
            {
                return errorResponse(res, 'FILE_TOO_LARGE');
            }

            if (!acceptedImageTypes.includes(imageType))
            {
                return errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
            }       
            
            fs.rename(files.imageShadows.path, imageURL, (error) => {

                if (error)
                {
                    console.log(error);
                }              
            });  

            productView.imageShadowsURL = imageURL;   
        }

        if (files.imageHighlights)
        {  
            const imageType = files.imageHighlights.type.split('/').pop();              
            const imageURL = `images/views/${productView._id}.highlights.${imageType}`;

            if (files.imageHighlights.size > MAX_FILE_SIZE)
            {
                return errorResponse(res, 'FILE_TOO_LARGE');
            }

            if (!acceptedImageTypes.includes(imageType))
            {
                return errorResponse(res, 'UNSUPPORTED_EXTENSIONS');
            }       
            
            fs.rename(files.imageHighlights.path, imageURL, (error) => {

                if(error)
                {
                    console.log(error);
                }              
            });  

            productView.imageHighlightsURL = imageURL;   
        }

        productView.save((err, result) => {

            if (err)
            {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            if (mainView)
            {
                Product.findById(product)
                .exec((err, product) => {

                    if (err || !product)
                    {
                        return res.status(400).json({
                            error: 'Product not found'
                        });
                    }

                    product.mainView = result;

                    product.save((err) => {

                        console.log(err);

                        if (err)
                        {
                            return res.status(400).json({
                                error: errorHandler(err)
                            });
                        }
                    });
                });
            }

            res.json(result);
        });
    });
};

//DELETE PRODUCT VIEW
exports.remove = (req, res) => {

    let productView = req.productView;

    productView.remove((err) => {

        if (err)
        {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        if (productView.imageURL != undefined)
        {
            fs.unlink(productView.imageURL, (error) => {
                if(error){ console.log(error); }
            });
        }

        if (productView.imageBaseURL != undefined)
        {
            fs.unlink(productView.imageBaseURL, (error) => {
                if(error){ console.log(error); }
            });
        }

        if (productView.imageShadowsURL != undefined)
        {
            fs.unlink(productView.imageShadowsURL, (error) => {
                if(error){ console.log(error); }
            });
        }

        if (productView.imageHighlightsURL != undefined)
        {
            fs.unlink(productView.imageHighlightsURL, (error) => {
                if(error){ console.log(error); }
            });
        }

        Product.findById(productView.product)
        .exec((err, product) => {

            if (err || !product)
            {
                return res.status(400).json({
                    error: 'Product not found'
                });
            }

            if (_.isEqual(product.mainView, productView._id))
            {
                ProductView.findOne({product: product._id})
                .exec((err, pview) => {

                    if (err)
                    {
                        return res.status(400).json({
                            error: err
                        });
                    }

                    if (pview)
                    {
                        product.mainView = pview;

                        product.save((err) => {

                            console.log(err);
    
                            if (err)
                            {
                                return res.status(400).json({
                                    error: errorHandler(err)
                                });
                            }
                            else
                            {
                                res.json({
                                    message: 'Product View deleted successfully'
                                });
                            }
                        });
                    }
                    else
                    {
                        res.json({
                            message: 'Product View deleted successfully'
                        });
                    }
                });
            }
            else
            {
                res.json({
                    message: 'Product View deleted successfully'
                });
            }
        });
    });
};

//LIST PRODUCT VIEWS
exports.list = (req, res) => {

    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    //let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const queryFilter = req.product ? {product : req.product}  : {};

    ProductView.find(queryFilter)
    .select()
    .sort([[sortBy, order]])
    //.limit(limit)
    .populate('product', 'mainView')
    .exec((err, productViews) => {

        if (err)
        {
            return res.status(400).json({
                error: 'Product views not found'
            });
        }
        
        res.json(productViews);
    });
};
