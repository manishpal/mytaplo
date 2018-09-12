const express = require('express');
const router = express.Router();
const brcData = require('../controllers/brcdata/index');
router.get('/getdata', brcData.index);
module.exports = router;
