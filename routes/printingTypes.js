const express = require('express');
const router = express.Router();
const { list, create } = require('../controllers/printingType');
const {isAuth, isAdmin} = require('../controllers/auth');

router.post("/printing-types", isAuth, isAdmin, create);
router.get('/printing-types', list);

module.exports = router;
