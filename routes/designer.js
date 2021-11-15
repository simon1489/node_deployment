const express = require('express');
const router = express.Router();
const { jsonData } = require('../controllers/designer');
const { productByIdWithViews } = require('../controllers/product');

router.get('/designer/products/:productId/:color?', jsonData);
router.param('productId', productByIdWithViews);

module.exports = router;
