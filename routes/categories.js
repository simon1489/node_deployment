const express = require('express');
const router = express.Router();
const {categoryById, create, read, update, remove, list } = require('../controllers/category');
const {isAuth, isAdmin} = require('../controllers/auth');

router.post("/categories", isAuth, isAdmin, create);
router.get("/categories/:categoryId", isAuth, isAdmin, read);
router.put("/categories/:categoryId", isAuth, isAdmin, update);
router.delete("/categories/:categoryId", isAuth, isAdmin, remove);
router.get('/categories', list);

router.param('categoryId', categoryById);

module.exports = router;
