const viewHelper = require('../../views/view_handler');
const mongoose = require('mongoose');
const transactionModel = mongoose.model('Transaction');
const TickerToken = mongoose.model('TickerToken');
const jsonHelper = require('../utils/getResponseController');
const moment = require('moment');
var kite = require('../utils/kite');


exports.home = async (req,res) => {
	//console.log("came here", req.user);
	let transactions = await transactionModel.find({user : req.user.id, deleted : false});
	let liveTickerToken = await TickerToken.findOne({});
	let months = await this.getLivePrices(liveTickerToken.accessToken);
	let params = { 
					transactions : transactions, 
					months: months, 
					tickerToken : liveTickerToken.accessToken ,
					apiKey : process.env.Z_API_KEY
				};

    return viewHelper.renderViewWithParams(params, res, {view : 'dashboard'})
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
	console.log("instruments are", instruments);

	let response = await kite.getQuotesLtp(instruments, accessToken);
	months = months.map(function(m){
		m.instruments = m.instruments.map(function(i){
			return {
				code : i,
				price : response["CDS:"+i].last_price
			};
		})
		return  m;
	});

	return months;
};


exports.livePrices = async (req, res) => {
	let liveTickerToken = await TickerToken.findOne({});
	let months = await this.getLivePrices(liveTickerToken.accessToken);
	res.status(200).json(jsonHelper.getResponse("Success",null,{data : months}));
};


exports.addTickerToken = async (req, res) => {
	let request_token = req.body.token;
	if(req.body.auth === process.env.AUTH_SECRET){ 
		kite.initialize();
		res.status(200).json(jsonHelper.getResponse("Success",null,{data : []}));
	}else
		res.status(403).json(jsonHelper.getResponse("Failure", null, {data : []}));

	
}