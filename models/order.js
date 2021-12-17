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

        term: {
            type: Number,
        },

        trFee: {
            type: Number,
            required: true,
        },

        dish: {
            type: Number,
            required: true,
        },

        tasty: {
            type: Number,
            required: true,
        },

        atmosphere: {
            type: Number,
            required: true,
        },

        goodService: {
            type: Number,
            required: true,
        },

        porcent: {
            type: Number,
            required: true,
        },

        valueStar: {
            type: Number,
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
            
        },

        shipped_date: {
            type: Date,
        },

        order_total: {
            type: Number,
            
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
            maxlength: 128,
        },

        customer_email: {
            type: String,
            trim: true,
        },

        customer_addressLine1: {
            type: String,
            trim: true,
            maxlength: 256,
        },

        customer_phone: {
            type: String,
            trim: true,
        },

        customer_city: {
            type: String,
            trim: true,
            maxlength: 128,
        },

        customer_state: {
            type: String,
            maxlength: 128,
        },

        customer_zipCode: {
            type: String,
            trim: true,
            maxlength: 128,
        },

        customer_country: {
            type: String,
            maxlength: 128,
            default: 'United States',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
