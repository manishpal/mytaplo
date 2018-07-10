const viewHelper = require('../../views/view_handler');
const mongoose = require('mongoose');
const PositionModel = mongoose.model('Position');
const jsonHelper = require('../utils/getResponseController');
const moment = require('moment');
var kite = require('../utils/kite');


exports.createPortfolio = async (req, res) => {

	let request_token = req.body.request_token;
	let access_token = req.body.access_token;
	let positions = await kite.getPositions(request_token, access_token);
	var validCurr = ['USDINR', 'GBPINR', 'EURINR'];
	//We want only currency positions
	var currPositions = [];
	for(var i=0;i < positions.net.length; i++){
		var position = positions.net[i];
		if(validCurr.indexOf(position.tradingsymbol.substring(0,6)) !== -1){
			currPositions.push(position);
		}
	}

	let existingPosition = await PositionModel.findOne({user : req.user});
	if(!existingPosition)
		existingPosition = new PositionModel({user : req.user});

	existingPosition.positions = JSON.stringify(currPositions);
	existingPosition.save();
	res.status(200).json(jsonHelper.getResponse("Success",null,{data : existingPosition}));
};