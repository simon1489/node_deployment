const express = require('express');
const router = express.Router();
const {isAuth, isAdmin} = require('../controllers/auth');
const { productById } = require('../controllers/product');
const {
    productViewById
    ,create
    ,read
    ,remove
    ,update
    ,list
} = require('../controllers/productView');

//ADMIN PRODUCT ROUTES
//router.post("/products/:productId/productViews", isAuth, isAdmin, create);
//router.get("/products/:productId/productViews", isAuth, isAdmin, list);
//router.delete("/products/:productId/productViews/:productViewId", isAuth, isAdmin, remove);
//router.put("/products/:productId/productViews/:productViewId", isAuth, isAdmin, update);


router.post("/products/:productId/productViews", create);
router.get("/products/:productId/productViews", list);
router.delete("/products/:productId/productViews/:productViewId", remove);
router.put("/products/:productId/productViews/:productViewId", update);




router.param('productViewId', productViewById);
router.param('productId', productById);

module.exports = router;
