const ProductRating = require('../models/productRating');
const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');


//GET RATING LIST BY PRODUCT ID
exports.ratingByProductId = (req, res) => {
    let product_id = req.params.productId;
    ProductRating.find({product: product_id})
    .populate('user', '_id name')
    .exec((err, productRating) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(productRating);
    });
};


//GET RATING BY PRODUCT ID AND USER ID
exports.ratingByProductIdAndUser = (req, res) => {
    let user_id = req.params.userId;
    let product_id = req.params.productId;
    if (!user_id || !product_id) {
        return res.status(401).json({message: 'MISSING_REQUIRED_FIELDS'})
    }
    ProductRating.find({user: user_id, product: product_id}).exec((err, productRating) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(productRating);
    });
};


//CREATE PRODUCT-RATING
exports.create = async (req, res) => {
    const { rating, review, product, user} = req.body;

    if (!rating || !review || !product ) {
        return res.status(401).json({message: 'MISSING_REQUIRED_FIELDS'})
    }
    const productRating = new ProductRating(req.body);
    //if (user) {
        //const ratingFound = await ProductRating.findOne({user: user , product: product});
        //if (ratingFound) {
        //    return res.status(301).json({message: 'The rating already exist'})
        //}
    //}
    
    
    
    let ratingResult = null;
    try {
        ratingResult = await productRating.save();
        productRatingResult = await Product.findOneAndUpdate({ _id: product }, {$inc : {'rateCount' : 1, 'rateValue' : rating}}, { new: true });
    }
    catch (err) {
        console.log(err);
            return  res.status(400).json({
                        error : errorHandler(err)
                    });
    }
    return res.status(201).json(ratingResult);
    
}

//REMOVE PRODUCT-RATING
exports.remove = (req, res) => {
    let user_id = req.params.userId;
    let product_id = req.params.productId;
    if (!user_id || !product_id) {
        return res.status(401).json({message: 'MISSING_REQUIRED_FIELDS'})
    }
    ProductRating.findOneAndRemove({user: user_id, product: product_id}).exec((err, productRating) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(productRating);
    });
};

