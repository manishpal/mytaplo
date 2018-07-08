var KiteConnect = require("kiteconnect").KiteConnect;
const mongoose = require('mongoose');
const TickerToken = mongoose.model('TickerToken');
exports.initialize = async function(){
	var kc = new KiteConnect({
				api_key: process.env.Z_API_KEY
			});
	let liveTickerToken = await TickerToken.findOne({});
	if(liveTickerToken == null)
		liveTickerToken = new TickerToken({});
	kc.generateSession(request_token, process.env.Z_API_SECRET).then(function(response) {
		//save ticker token in db for further use
		console.log("got response", response);	
		liveTickerToken.accessToken = response.access_token;
		liveTickerToken.save();
		console.log("liveTickerToken", liveTickerToken);
	}).catch(function(err) {
		console.log(err);
	});
};

exports.getQuotesLtp = function(instrumentNames, access_token){
	console.log("access_token", access_token);
	var kc = new KiteConnect({api_key : process.env.Z_API_KEY, access_token: access_token, debug: false});
	return kc.getLTP(instrumentNames).then(function(response){
		//console.log("got resp", response);
		return response;
	}).catch(function(err){
		//console.log("got err", err);
		return undefined;
	});
}