const express = require('express');
const router = express.Router();

const apiV1 = require('./apiV1/index');
const views = require('./views/index');

router.use('/api/v1',apiV1),

router.use('/view',views);

module.exports = router;