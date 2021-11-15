
const {errorHandler} = require('../helpers/dbErrorHandler');
const fs = require('fs');

//LIST CATEGORIES
exports.shipping = (req, res) => {
    const shippingZonesPath = './helpers/shippingZones.json';
    const shippingRatesPath = './helpers/shippingRatesByZones.json';    
    const weight = req.query.weight ? req.query.weight : 1;
    let zone = undefined; 
    let zipCode = req.query.zipCode ? req.query.zipCode : undefined;

    if (zipCode === undefined) return 0;

    fs.readFile(shippingZonesPath, 'utf8', (err, data) => {
        if (err) 
        {
            throw err;
        }

        const jsonData = JSON.parse(data);

        zone = jsonData[zipCode];     

        if (zone === undefined){
            zipCode = zipCode.substring(0,3);
            zone = jsonData[zipCode];
        }

        console.log("zone", zone)

        if (zone === undefined) return undefined;

        fs.readFile(shippingRatesPath, 'utf8', (err, data) => {
            if (err) 
            {
                throw err;
            }
    
            const jsonData = JSON.parse(data);
            console.log("rate", jsonData[weight][zone])
    
            return res.json({rate: jsonData[weight][zone]});  
        });
    });   
};