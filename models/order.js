const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: ObjectId,
            ref: 'User',
            default: null,
        },

        product: {
            type: String,
            required: true,
        },

        product_id: {
            type: String,
            required: true,
        },


        status: {
            type: String,
            enum: ['pending_payment', 'open', 'hold', 'processed', 'shipped', 'completed', 'canceled'],
            default: 'pending_payment',
        },

        is_paid: {
            type: Boolean,
            default: false,
        },

        order_date: {
            type: Date,
            required: true,
        },

        shipped_date: {
            type: Date,
        },

        order_total: {
            type: Number,
            required: true,
        },
       

        payment_method: {
            type: String,
            enum: ['paypal', 'stripe', 'credit_card'],
            default: 'paypal',
        },

        comments: {
            type: String,
            maxlength: 256,
        },

        customer_name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 128,
        },

        customer_email: {
            type: String,
            trim: true,
            required: true,
        },

        customer_addressLine1: {
            type: String,
            trim: true,
            maxlength: 256,
            required: true,
        },

        customer_phone: {
            type: String,
            trim: true,
            required: true,
        },

        customer_city: {
            type: String,
            trim: true,
            maxlength: 128,
            required: true,
        },

        customer_state: {
            type: String,
            maxlength: 128,
            required: true,
        },

        customer_zipCode: {
            type: String,
            trim: true,
            maxlength: 128,
            required: true,
        },

        customer_country: {
            type: String,
            maxlength: 128,
            required: true,
            default: 'United States',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
