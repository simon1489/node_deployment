const {errorHandler} = require('../helpers/dbErrorHandler');
const ProductView = require('../models/productView');

//LIST PRINTING TYPES
exports.jsonData = (req, res) => {

    const apiUrl = process.env.API_URL || "http://localhost:8000/api";

    req.product.image = undefined;
    let views = req.views ? req.views : [];

    let colorFill = "#5E5F5F";

    if (req.params && req.params.color && req.params.color !== 'default')
    {
        colorFill = req.params.color;
    }

    let colorsArr = [];

    if (req.product && req.product.colorList)
    {
        Object.keys(req.product.colorList).map( (key) => {
            if(req.product.colorList[key])
            {
                colorsArr.push(`#${key}`);
            }
        });
    }    

    arrViews = [];
 
    views.forEach(view  => {

        elementArr = [];

        if(view.imageBaseURL !== undefined){
            elementArr.push({
                "type": "image",
                "source": `${apiUrl}/${view.imageBaseURL}`,
                "title": "Base",
                "parameters": {
                    "autoCenter": true,
                    "colors": `${colorsArr.join()}`,
                    "colorLinkGroup": "Base",
                    "fill": colorFill,
                    "price": 20,
                }
            });
        }

        if(view.imageShadowsURL !== undefined){
            elementArr.push({
                "type": "image",
                "source": `${apiUrl}/${view.imageShadowsURL}`,
                "title": "Shadow",
                "parameters": {
                    "autoCenter": true,
                    "fill": false,
                }
            });
        }     

        if(view.imageHighlightsURL !== undefined){
            elementArr.push({
                "type": "image",
                "source": `${apiUrl}/${view.imageHighlightsURL}`,
                "title": "Highlights",
                "parameters": {
                    "autoCenter": true,
                    "fill": false,
                }
            });
        }   

        arrViews.push({
            "title": view.name,
            "thumbnail": `${apiUrl}/${view.imageURL}`,
            "elements": elementArr
        });
    });

    jsonObj = [arrViews];
 
    res.json(jsonObj);
};
