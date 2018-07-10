const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const transactionController = require('../../controllers/transactions/transactionController');
const portfolioController = require('../../controllers/portfolio/portfolioController');


router.post('/add', ensureLoggedIn('/login'), transactionController.add);
router.post('/updatePositions', portfolioController.createPortfolio)

module.exports = router;