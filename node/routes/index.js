const express = require('express');
const router = express.Router();

//const apiV1 = require('./apiV1/index');
const dashboard = require('./dashboard/index');
const home = require('../controllers/home/index');
const transaction = require('./transaction/index')
const passport = require('passport');
const kite = require('../controllers/utils/kite');

require('../passport')();

//router.use('/api/v1',apiV1),
router.use('/dashboard', dashboard);
router.use('/transactions', transaction);

router.get('/login', function(req, res){
	if(req.user){
		res.redirect('/dashboard')
		return;
	}
	res.redirect("https://kite.trade/connect/login?v=3&api_key="+process.env.Z_API_KEY);
});

router.get('/logout', function(req, res){
	
	if(req.user){
		console.log("accesToken", req.user.accessToken);
		kite.logout(req.user.accessToken);
	}
	
	req.logout();
	res.redirect('/');
});

router.route('/dashboard/login').get( 
				passport.authenticate('zerodha-login', { failureRedirect: '/login' }), function(req, res){
					res.redirect('/dashboard');
			});

router.use('/', home.index);

module.exports = router;