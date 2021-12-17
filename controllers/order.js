const formidable = require('formidable');

const moment = require('moment');

const _ = require('lodash');
const {errorResponse} = require('../utils');

const Order = require('../models/order');
const OrderItem = require('../models/orderItem');

const Product = require('../models/product');
const {errorHandler} = require('../helpers/dbErrorHandler');
const order = require('../models/order');
const fs = require('fs');

// Middleware for get order by order_id
exports.orderById = (req, res, next, id) => {

    Order.findById(id).exec((err, order) => {
        if (err || !order)
        {
            return res.status(400).json({
                error: 'Order not found'
            });
        }

        req.order = order;

        next();
    });
};

//GET ORDERS LIST 
exports.list = (req, res) => {
    //let user_id = req.params.userId;
    Order.find()
    .exec((err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(order);
    });
};

exports.orderByIdWithItems = (req, res) => {
   
    let order = req.order;
    
    OrderItem.find({order_id: order._id})
    .select()
    .populate('product_id', '_id name printingType')
    .exec((err, orderItems) => {
        if (err)
        {
            return res.status(400).json({
                error: 'Order Items not found'
            });
        }    
        return res.json({order, orderItems});  
    });     
};

exports.ordersByProductId = (req, res) => {
    let productId = req.params.productId;

    Order.find({product_id: productId})
    .select()
    .exec((err, orders) => {

        if (err)
        {
            return res.status(400).json({
                error: 'Ordes not found'
            });
        }       
        
        return res.json({orders});  
    });     
};

exports.listByUser = (req, res) => {
    let user_id = req.params.userId;
    Order.find({user_id: user_id})
    .exec((err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        console.log('order',order)
        res.json(order);
    });
};

const findProductByID = async (productID) => {

    let product = null;

    try
    {
        product = await Product.findById(productID).exec();
    }
    catch (err)
    {
        console.log(err);
    }

    return product;
}

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
    if (weight === undefined) return undefined;

    const shippingRatesData = fs.readFileSync(shippingRatesPath, {encoding:'utf8'});
    const jsonShippingRatesData = JSON.parse(shippingRatesData);

    return jsonShippingRatesData[weight][zone];  

}

// Create Order
exports.create = (req, res) => {

    let form =  new formidable.IncomingForm();
    form.parse(req, async (err, fields) => {

        if (err)
        {
            return res.status(400).json({
                error : 'Error on creating order: Incorrect data'
            });
        }

        console.log('campos:',fields);
        const {
            name,
            phone,
            email,
            addressLine1,
            city,
            state,
            term,
            trFee,
            valueStar,
            dish,
            tasty,
            atmosphere,
            goodService,
            porcent,
            postalCode,
            product,
            price, 
            product_id
        } = fields;
        
        if (!name || !phone || !email || !addressLine1 || !city || !state || !postalCode || !product || !price || !product_id)
        {
            //return errorResponse(res, 'MISSING_REQUIRED_FIELDS');
        }

        let _orderItems;
        let _orderTotal = 0;
        let _orderSubTotal = 0;
        let _orderShippingFee = 0;
        let _orderQty = 0;
        let _weight = 0;
        let discardItems = [];
        
        if (product !== undefined)
        {
            _orderItems = JSON.parse(product);
            //console.log('_orderItems',_orderItems);
            if (_orderItems.length === 0)
            {
                return res.status(400).json({
                    error : 'Not selected products.'
                });
            }
            else
            {
                let productTypeID, missingItemsData, quantity, price;

                for(let i = 0; i < _orderItems.length; i++)
                {
                    productTypeID = _orderItems[i].productType;
                    missingItemsData = false;
                    quantity = parseInt(_orderItems[i].qty);
                    price = parseInt(_orderItems[i].price);

                    if (!productTypeID || !_orderItems[i].qty || !_orderItems[i].price || !_orderItems[i].product)
                    {
                        missingItemsData = true;
                    }
                    else
                    {
                        const product = await findProductByID(productTypeID);
                        //console.log('PRODUCT.....:',product)
                        if (!product)
                        {
                            missingItemsData = true;
                        }
                        else
                        {
                            quantity = quantity === 0 ? 1 : quantity;

                            if (price === 0 || price !== product.price)
                            {
                                price = product.price;
                            }

                            _weight += parseFloat(product.weight);

                            _orderSubTotal += (quantity * price);
                            _orderQty += quantity;

                            _orderItems[i].qty = quantity;
                            _orderItems[i].price = price;
                        }
                    }              

                    if (missingItemsData)
                    {
                        discardItems.push(_orderItems[i].id);
                    }                    
                }
            }

        }
        else
        {
            return res.status(400).json({
                error : 'Not selected products.'
            });
        }

        //_orderShippingFee = await getShippingFee(postalCode, Math.ceil(_weight));
/*   term,
            trFee,
            valueStar,
            dish,
            tasty,
            goodService,
            porcent,*/
        let _order = {
            order_date: moment().format(),
            order_total: price,
            order_subtotal: _orderSubTotal,
            trFee: trFee,
            term: term,
            dish: dish,
            tasty: tasty,
            goodService: goodService,
            atmosphere: atmosphere,
            porcent: porcent,
            valueStar: valueStar,

            //order_shipping_fee: _orderShippingFee,
            order_qty: _orderQty,
           // customer_name: name,
           // customer_email: email,
           // customer_addressLine1: addressLine1,
           // customer_phone: phone,
           // customer_city: city,
          //  customer_state: state,
          ///  customer_zipCode: postalCode,
            product: product,
            product_id: product_id,
        };
        
        let order = new Order(_order);
        console.log('order:',order)
        order.save((err, data) => {

            if(err)
            {
                return res.status(400).json({
                    error : errorHandler(err)
                });
            }
            
       
            res.status(201).json(data);            
        });
    });
}

// Update Order
exports.update = (req, res) => {

    console.log('UPDATE ORDER');

    let form =  new formidable.IncomingForm();
    
    form.parse(req, async (err, fields) => {

        if (err)
        {
            return res.status(400).json({
                error : 'Error on creating order: Incorrect data'
            });
        }

        const {
            name,
            phone,
            email,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            orderItems,
            orderTotal,
            orderSubtotal,
            shippingFee
        } = fields;        

        if (!name || !phone || !email || !addressLine1 || !addressLine2 || !city || !state || !postalCode || !orderItems || !orderTotal  || !shippingFee)
        {
            return errorResponse(res, 'MISSING_REQUIRED_FIELDS');
        }

        let _orderItems;
        let _orderTotal = 0;
        let _orderSubTotal = 0;
        let _orderShippingFee = 0;
        let _orderQty = 0;
        let _weight = 0;
        let discardItems = [];

        if (orderItems !== undefined)
        {
            _orderItems = JSON.parse(orderItems);


            if (_orderItems.length === 0)
            {
                return res.status(400).json({
                    error : 'Not selected products.'
                });
            }
            else
            {
                let productTypeID, missingItemsData, quantity, price;

                for(let i = 0; i < _orderItems.length; i++)
                {
                    productTypeID = _orderItems[i].productType;
                    missingItemsData = false;
                    quantity = parseInt(_orderItems[i].qty);
                    price = parseInt(_orderItems[i].price);

                    if (!productTypeID || !_orderItems[i].qty || !_orderItems[i].price || !_orderItems[i].product)
                    {
                        missingItemsData = true;
                    }
                    else
                    {
                        const product = await findProductByID(productTypeID);

                        if (!product)
                        {
                            missingItemsData = true;
                        }
                        else
                        {
                            quantity = quantity === 0 ? 1 : quantity;

                            if (price === 0 || price !== product.price)
                            {
                                price = product.price;
                            }

                            _weight += parseFloat(product.weight);

                            _orderSubTotal += (quantity * price);
                            _orderQty += quantity;

                            _orderItems[i].qty = quantity;
                            _orderItems[i].price = price;
                        }
                    }                   

                    if (missingItemsData)
                    {
                        discardItems.push(_orderItems[i].id);
                    }
                }
            }
        }
        else
        {
            return res.status(400).json({
                error : 'Not selected products.'
            });
        }

        _orderShippingFee = await getShippingFee(postalCode, Math.ceil(_weight));   

        let _order = {
            order_date: moment().format(),
            order_total: _orderSubTotal + _orderShippingFee,
            order_subtotal: _orderSubTotal,
            order_shipping_fee: _orderShippingFee,
            order_qty: _orderQty,
            customer_name: name,
            customer_email: email,
            customer_addressLine1: addressLine1,
            customer_addressLine2: addressLine2,
            customer_phone: phone,
            customer_city: city,
            customer_state: state,
            customer_zipCode: postalCode,
        };
        
        //let order = new Order(_order);
        let order = req.order;
        order = _.extend(order, _order);

        order.save((err, data) => {

            if(err)
            {
                return res.status(400).json({
                    error : errorHandler(err)
                });
            }
            else
            {
                //remove está deprecada, hay que actualizar esto
                OrderItem.deleteMany({order_id : data._id}, function(err) {console.log(err)})

                _orderItems.map(orderItemRow => {

                    let mustBeDiscarded = discardItems.filter(row => orderItemRow.id === row.id).length > 0;

                    if (mustBeDiscarded === false)
                    {
                        let _orderItem = {
                            order_id: data._id,
                            guid: orderItemRow.guid,
                            product_id: orderItemRow.productType,
                            qty: orderItemRow.qty,
                            price: orderItemRow.price,
                            color: orderItemRow.color,
                            size: orderItemRow.size,
                            product_obj: orderItemRow.product,
                        }

                        let orderItem = new OrderItem(_orderItem);

                        orderItem.save((err, orderItemData) => {

                            if (err)
                            {
                                return res.status(400).json({
                                    error : errorHandler(err)
                                });
                            }
                        });
                    }
                });
            }
       
            res.status(201).json(data);            
        });
    });
}

// Update Order Status
exports.updateStatus = (req, res) => {
    let order = req.order;

    if(req.body.status)
    {
        order.status = req.body.status;       
    }

    if(req.body.is_paid)
    {
        order.is_paid = req.body.is_paid;       
    }

    order.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(result);
    }); 
    
}
