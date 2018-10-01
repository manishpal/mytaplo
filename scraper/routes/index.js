const express = require('express');
const router = express.Router();
const brcData = require('../controllers/brcdata/index');
router.get('/getdata', brcData.index);
router.get('/getIecData', brcData.iecInfo);
module.exports = router;
