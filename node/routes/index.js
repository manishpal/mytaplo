const express = require('express');
const router = express.Router();

//const apiV1 = require('./apiV1/index');
const dashboard = require('./dashboard/index');
const home = require('../controllers/home/index');

//router.use('/api/v1',apiV1),
router.use('/dashboard',dashboard);
router.use('/', home.index);

module.exports = router;