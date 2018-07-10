var KiteConnect = require("kiteconnect").KiteConnect;
const mongoose = require('mongoose');
const TickerToken = mongoose.model('TickerToken');
exports.initialize = async function(request_token){
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

exports.getQuotesFull = function(instrumentNames, access_token){
	//console.log("access_token", access_token);
	var kc = new KiteConnect({api_key : process.env.Z_API_KEY, access_token: access_token, debug: false});
	return kc.getQuote(instrumentNames).then(function(response){
		//console.log("got resp", response);
		return response;
	}).catch(function(err){
		console.log("got err", err);
		return undefined;
	});
}

exports.login = function(request_token){
	var kc = new KiteConnect({api_key: process.env.Z_API_KEY});
	return kc.generateSession(request_token, process.env.Z_API_SECRET).then(function(response) {
		return response;
	}).catch(function(err){
		console.log("got error from login", err);
	});
};

exports.logout = function(access_token){
	var kc = new KiteConnect({api_key: process.env.Z_API_KEY});
	return kc.invalidateAccessToken(access_token).then(function(res){
		return res;
	}).catch(function(err){
		console.log("got err while loggin out", err);
	})
};

exports.getPositions = function(request_token, access_token) {
	let params = {api_key : process.env.Z_API_KEY};
	console.log("request_token", request_token, access_token);
	if(access_token)
		params.access_token = access_token;
	var kc = new KiteConnect(params);
	if(request_token){
		return kc.generateSession(request_token, process.env.Z_API_SECRET).then(function(response){
			console.log("got auth resp", response);
			//Now fetch current positions
			return kc.getPositions().then(function(resp){
				console.log("got positions", resp);
				return resp;
			}).catch(function(err){
				console.log("got err in getting positions", err);
			})

		}).catch(function(err){
			console.log(err);
		});
	}else{
		return kc.getPositions().then(function(resp){
			console.log("got positions", resp);
			return resp;
		}).catch(function(err){
			console.log("got err", err);
		});
	}
}