const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const orderItemSchema = new mongoose.Schema(
    {
        order_id: {
            type: ObjectId,
            ref: 'Order',
            required: true
        },

        product_id: {
            type: ObjectId,
            ref: 'Product',
            required: true
        },

        status: {
            type: String,
            enum: ['open', 'hold', 'approved', 'processed'],
            default: 'open'
        },

        qty: {
            type: Number,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        color: {
            type: String,
            required: true
        },

        size: {
            type: String,
            required: true
        },

        comments: {
            type: String,
            maxlength: 256
        },

        product_obj: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        guid: {
            type: String,
            maxlength: 256,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('OrderItem', orderItemSchema);
