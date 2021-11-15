const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productViewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 256
        },
        price: {
            type: Number,
            maxlength: 32
        },
        imageURL: {
            type: String,
            trim: true
        },
        imageBaseURL: {
            type: String,
            trim: true
        },
        imageShadowsURL: {
            type: String,
            trim: true
        },
        imageHighlightsURL: {
            type: String,
            trim: true
        },
        product: {
            type: ObjectId,
            ref: 'Product',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('ProductView', productViewSchema);