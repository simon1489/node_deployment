const express = require('express');
const router = express.Router();
const {
    orderById
    ,orderByIdWithItems
    ,ordersByProductId
    ,create
    ,update
    ,updateStatus
    ,list
    ,listByUser
} = require('../controllers/order');

router.get("/orders", list);
router.get("/orders/:orderId", orderByIdWithItems);
router.get("/orderItems/:orderId", orderByIdWithItems);
router.get("/orders/products/:productId", ordersByProductId);
////es como deberia estar la siguiente linea router.get("/orders/user/:userId", isAuth, isOwner, listByUser);
router.get("/orders/user/:userId", listByUser);
router.post("/orders", create);
router.put("/orders/:orderId", update);
router.put("/orders/:orderId/status", updateStatus);

router.param('orderId', orderById);

module.exports = router;
