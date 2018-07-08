const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const dashboardController = require('../../controllers/dashboard/dashboardController');

router.get('/', ensureLoggedIn('/login'), dashboardController.home);
router.post('/addTickerToken', dashboardController.addTickerToken);
router.get('/livePrices', dashboardController.livePrices);

module.exports = router;