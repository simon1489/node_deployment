const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productRatingSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
            trim: true,
            required: true,
            maxlength: 256
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
            required: true,
            index: true
        }
    },
    { timestamps: true }
);


module.exports = mongoose.model('ProductRating', productRatingSchema);