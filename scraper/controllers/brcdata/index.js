const jsonHelper = require('../utils/getResponseController');
const iecData = require('../utils/iec_fetch');
const mongoose = require('mongoose');
const BrcModel = mongoose.model('BrcData');
exports.index = async (req,res) => {
	let iec_code = req.query.iec_code;
	let count = parseInt(req.query.count) || 10;
	let model = await BrcModel.findOne({iecCode : iec_code});
	console.log("got data from db", model, "with iec code", iec_code);
	let brcData = undefined;
	if(model && model.jsonData){
		brcData = JSON.parse(model.jsonData);
	}else{
		brcData = await iecData(iec_code, count);
		console.log("got brc data", brcData);
		let brcModelData = new BrcModel({iecCode :req.query.iec_code, jsonData : JSON.stringify(brcData)});
		brcModelData = await brcModelData.save();
	}
  res.status(200).json(jsonHelper.getResponse("Success",null,{data : brcData}));
}
