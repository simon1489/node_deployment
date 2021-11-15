const express = require("express");
const router = express.Router();
const { generateToken, processPayment } = require("../controllers/braintree");

router.get("/braintree/getToken", generateToken);
router.post("/braintree/processPayment", processPayment);

module.exports = router;