const express = require('express');
const router = express.Router();
const { shipping } = require('../controllers/shipping');

router.get('/shipping/rates', shipping);

module.exports = router;
