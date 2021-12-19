const express = require('express');
const router = express.Router();
const {isAuth, isAdmin} = require('../controllers/auth');
const {
    productById
    ,getByLoginId
    ,create
    ,read
    ,remove
    ,update
    ,list
} = require('../controllers/product');

//ADMIN PRODUCT ROUTES
router.post("/products", isAuth, isAdmin, create);
router.get("/products/login/:owner_user_id", getByLoginId);
router.get("/products/:productId",  read);
router.delete("/products/:productId", isAuth, isAdmin, remove);
router.put("/products/:productId", isAuth, isAdmin, update);
//ECOMMERCE PRODUCTS ROUTE
router.get("/products", list);


router.param('productId', productById);

module.exports = router;
