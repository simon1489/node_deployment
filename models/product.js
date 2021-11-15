const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 256
        },
        descr: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            maxlength: 32
        },
        qty: {
            type: Number,
            required: true,
            default: 0
        },
        sold_qty: {
            type: Number,
            required: true,
            default: 0
        },
        imageURL: {
            type: String,
            trim: true,
        },
        mainView: {
            type: ObjectId,
            ref: 'ProductView'
        },
        imageType: {
            type: String,
            enum: ['png', 'jpg', 'jpeg', 'svg']
        },
        category: {
            type: ObjectId,
            ref: 'Category',
            required: true
        },
        printingType: {
            type: ObjectId,
            ref: 'printingType'
        },
        colorList: {
            type: mongoose.Schema.Types.Mixed
        },
        sizeList: {
            type: mongoose.Schema.Types.Mixed
        },
        weight: {
            type: Number,
            required: true,
            default: 1
        },
        rateCount: {
            type: Number,
            default: 0
        },
        rateValue: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
