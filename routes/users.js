const express = require('express');
const router = express.Router();
const {isAuth, isAdmin, isOwner} = require('../controllers/auth');
const {userById, read, update} = require('../controllers/user');


router.get('/users/:userId', read);
router.put('/users/:userId', update);

router.get('/users/:userId', isAuth, isOwner, read);
router.put('/users/:userId', isAuth, isAuth, update);

router.param('userId', userById);

module.exports = router;