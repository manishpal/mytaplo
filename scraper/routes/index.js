const express = require('express');
const router = express.Router();
const brcData = require('../controllers/brcdata/index');
router.use('/getdata', brcData.index);
module.exports = router;
