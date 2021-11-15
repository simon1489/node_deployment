const express = require('express');
const router = express.Router();
const {
    orderById
    ,orderByIdWithItems
    ,create
    ,update
    ,updateStatus
} = require('../controllers/order');

router.get("/orders/:orderId", orderByIdWithItems);
router.post("/orders", create);
router.put("/orders/:orderId", update);
router.put("/orders/:orderId/status", updateStatus);

router.param('orderId', orderById);

module.exports = router;
