const express = require('express');
const router = express.Router();
const {isAuth, isAdmin} = require('../controllers/auth');
const {
    ratingByProductIdAndUser
    ,ratingByProductId
    ,create
    ,remove
    
} = require('../controllers/productRating');

router.get("/rating/products/:productId/user/:userId", ratingByProductIdAndUser);
router.get("/rating/products/:productId", ratingByProductId);
router.post("/rating", create);
router.delete("/rating", isAuth, isAdmin, remove);

module.exports = router;