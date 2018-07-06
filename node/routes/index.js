const express = require('express');
const router = express.Router();

//const apiV1 = require('./apiV1/index');
const dashboard = require('./dashboard/index');
const home = require('../controllers/home/index');
const transaction = require('./transaction/index')
const passport = require('passport');
require('../passport')();

//router.use('/api/v1',apiV1),
router.use('/dashboard', dashboard);
router.use('/transactions', transaction);

router.get('/login', function(req, res){
	res.render('login');
});

router.route('/login').post( 
				passport.authenticate('local', { failureRedirect: '/login' }), function(req, res){
					res.redirect('/dashboard');
			});

router.use('/', home.index);

module.exports = router;