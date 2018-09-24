const express = require('express');
const router = express.Router();
const brcController = require('../../controllers/brc/brcController');

router.get('/',  brcController.index);

module.exports = router;