const express = require('express');
const router = express.Router();

const viewsController = require('../../controllers/views/viewsController');

router.get('/', viewsController.index);

module.exports = router;