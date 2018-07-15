const mongoose = require('mongoose');
const transactionModel = mongoose.model('Transaction');
const jsonHelper = require('../utils/getResponseController');
const moment = require('moment');

exports.add = async (req,res) => {
	console.log("req.body is", req.body);
	let data ={user : req.user, currency : req.body.currency, amount : req.body.amount};
	data.transactionDate  = moment(req.body.transactionDate, "MM/DD/YYYY");
	data.status = 'pending';
	data.credit = req.body.credit? true : false
	const transactionData = await transactionModel.create(data);
    res.status(200).json(jsonHelper.getResponse("Success",null,{data : transactionData}));
}

exports.remove = async (req, res) => {
	let transaction = await transactionModel.findById(req.body.id);
	console.log("transaction Id is", transaction.user + "" === ""+req.user.id);
	if(transaction && transaction.user+"" === req.user.id+"" && transaction.status === "pending"){
		transaction.status = 'rejected';
		transaction.deleted = true;
		transaction.save();
		res.status(200).json(jsonHelper.getResponse("Success",null,{data : []}));
		return;
	}else
		res.status(403).json(jsonHelper.getResponse("Failure",null,{data : []}));
	
}