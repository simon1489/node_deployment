const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productRatingSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true,
        },
        review: {
            type: Array,
            trim: true,
            required: true,
            
        },
        product: {
            type: ObjectId,
            ref: 'Product',
            required: true,
            index: true
        },
        user: {
            type: ObjectId,
            ref: 'User',
            index: true
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('ProductRating', productRatingSchema);