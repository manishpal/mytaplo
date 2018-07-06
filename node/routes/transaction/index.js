const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const transactionController = require('../../controllers/transactions/transactionController');

router.post('/add', ensureLoggedIn('/login'), transactionController.add);

module.exports = router;