const braintree = require('braintree');
const Order = require('../models/order');
const utils = require('../utils');
require('dotenv').config();
const fs = require('fs');

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

const getShippingFee = async (zipCode , weight) => {
    const shippingZonesPath = './helpers/shippingZones.json';
    const shippingRatesPath = './helpers/shippingRatesByZones.json';    
    let zone = undefined; 

    if (zipCode === undefined) return 0;

    const zoneData = fs.readFileSync(shippingZonesPath, {encoding:'utf8'});
    const jsonZoneData = JSON.parse(zoneData);
    zone = jsonZoneData[zipCode];     

    if (zone === undefined){
        zipCode = zipCode.substring(0,3);
        zone = jsonZoneData[zipCode];
    }

    if (zone === undefined) return undefined;

    const shippingRatesData = fs.readFileSync(shippingRatesPath, {encoding:'utf8'});
    const jsonShippingRatesData = JSON.parse(shippingRatesData);

    return jsonShippingRatesData[weight][zone];  
}

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let orderId = req.body.orderId;

    Order.findById(orderId).exec(async (err, result) => {
        if (err || !result) {
            console.log(err);
        }

        const order = result;

        if (order.order_total <= 0)
        {
            return utils.errorResponse(res, 'ORDER_TOTAL_GREATER_ZERO');
        }

        let zipCode = order.customer_zipCode;
        let orderShippingFee = await getShippingFee(zipCode, 2);   
        console.log(orderShippingFee)     

        gateway.transaction.sale(
            {
                amount: (parseFloat(order.order_subtotal) + parseFloat(orderShippingFee)).toFixed(2),
                paymentMethodNonce: nonceFromTheClient,
                options: {
                    submitForSettlement: true
                }
            },
            (error, result) => {
                if (error) {
                    res.status(500).json(error);
                } else {
                    res.json(result);
                }
            }
        );
    });
};
