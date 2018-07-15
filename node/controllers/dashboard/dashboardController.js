const viewHelper = require('../../views/view_handler');
const mongoose = require('mongoose');
const transactionModel = mongoose.model('Transaction');
const positionModel = mongoose.model('Position');
const TickerToken = mongoose.model('TickerToken');
const jsonHelper = require('../utils/getResponseController');
const moment = require('moment');
var kite = require('../utils/kite');


exports.home = async (req,res) => {
	//console.log("came here", req.user);
	let transactions = await transactionModel.find({user : req.user.id, deleted : false, status : {$in : ["pending", "accepted"]}});
	let months = await this.getLivePrices(req.user.accessToken);
	
	if(months === undefined){
		res.redirect('/logout');
		return;
	}

	let marketPositions = await this.getPositions(req.user);	

	let params = { 
					transactions : transactions, 
					months: months, 
					tickerToken : req.user.accessToken ,
					apiKey : process.env.Z_API_KEY,
					positions : marketPositions,
					hasPosition : marketPositions.length > 0,
					loggedIn : true
				};

    return viewHelper.renderViewWithParams(params, res, {view : 'dashboard'})
}


exports.getPositions = async (user) => {
	let positions = await kite.getPositions(undefined, user.accessToken);
	console.log("got positions", positions);
	var validCurr = ['USDINR', 'GBPINR', 'EURINR'];
	//We want only currency positions
	var currPositions = [];
	if(positions.net && positions.net.length > 0){
		currPositions = positions.net.filter(function(m){ return validCurr.indexOf(m.tradingsymbol.substring(0,6)) !== -1;});
	}

	if(!currPositions || currPositions.length === 0){
		let position = await positionModel.findOne({user : user});
		if(position)
			currPositions = JSON.parse(position.positions);
	}
	return currPositions;
}


exports.getLivePrices = async (accessToken) => {
	let currDate = moment();
	let months = [currDate, currDate.clone().add(31, 'days'), currDate.clone().add(62, 'days')]
				.map(function(d){ 
					return { 
							name : d.format("MMM YY"),
							instruments :  ['USD', 'EUR', 'GBP'].map(function(curr) { 
								return curr + 'INR' + d.format("YYMMM").toUpperCase() + 'FUT';
							})
						 };
				});
	
	let instruments = months.map(function(c){
		return c.instruments.map(function(i){return "CDS:" + i});
	});

	instruments = [].concat.apply([], instruments);	
	//console.log("instruments are", instruments);

	let response = await kite.getQuotesFull(instruments, accessToken);
	if(response === undefined)
		return response;

	months = months.map(function(m){
		m.instruments = m.instruments.map(function(i){
			var buy_price = 0;
			var sell_price = 0;
			var last_price = response["CDS:"+i].last_price;
			var depthData = response["CDS:"+i].depth
			if(depthData) {
				if(depthData.buy && depthData.buy.length > 0){
					buy_price = depthData.buy[0].price;
				}
				if(depthData.sell && depthData.sell.length > 0){
					sell_price = depthData.sell[0].price;
				}
			}

			return {
				code : i,
				buy_price : buy_price || last_price,
				sell_price : sell_price || last_price,
				price : last_price
			};
		})
		return  m;
	});

	return months;
};


exports.livePrices = async (req, res) => {
	if(!req.user){
		res.status(401).json(jsonHelper.getResponse("Failure", null, {data : 'Unauthorized'}));
		return;
	}

	let months = await this.getLivePrices(req.user.accessToken);
	if(months=== undefined){
		res.status(200).json(jsonHelper.getResponse("Failure", null, {data : 'Some api error'}));
		return;
	}
	res.status(200).json(jsonHelper.getResponse("Success",null,{data : months}));
};


exports.addTickerToken = async (req, res) => {
	let request_token = req.body.token;
	if(req.body.auth === process.env.AUTH_SECRET){ 
		kite.initialize(request_token);
		res.status(200).json(jsonHelper.getResponse("Success",null,{data : []}));
	}else
		res.status(403).json(jsonHelper.getResponse("Failure", null, {data : []}));

}