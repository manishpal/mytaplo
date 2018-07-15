const viewHelper = require('../../views/view_handler');
const mongoose = require('mongoose');
const transactionModel = mongoose.model('Transaction');
const jsonHelper = require('../utils/getResponseController');
const moment = require('moment');
var dasboardController = require('../dashboard/dashboardController');
var positionModel = mongoose.model('Position');


exports.updatePortfolio = async (req, res) => {
	let marketPositions = await dasboardController.getPositions(req.user);
	let today = new Date();
	let startOfMonth = moment([today.getFullYear(), today.getMonth()]);	
	let transactions = await transactionModel.find({user : req.user, status : { $in : ['accepted', 'pending']},
												 transactionDate : {$gt : startOfMonth}}).sort({'createdAt' : 1});
	let transactionMap = {};
	for(var i=0;i<transactions.length;i++){
		let transaction = transactions[i];
		let futName = transaction.getFutName();
		transactionMap[futName] = transactionMap[futName] || { sum : 0, transactions : []};
		transactionMap[futName].transactions.push(transaction);
		transactionMap[futName].sum += (transaction.credit? 1 : -1)*transaction.amount;
	}

	console.log("Transactions map", transactionMap);

	for(var [futName, transSumm] of Object.entries(transactionMap)){
		console.log("vals are", futName, transSumm);
		var futTransactions =  transSumm.transactions;
		var totalAmount = transSumm.sum;
		var quantity = Math.floor(Math.abs(totalAmount/1000));
		var buy = quantity < 0;
		var actualPosition = marketPositions.filter(function(p){ return p.tradingsymbol === futName;})[0];
		let actualQuantity = 0;
		if(actualPosition)
			actualQuantity = actualPosition.quantity;

		console.log("actual quantity", actualQuantity, quantity);
		
		for(var i=futTransactions.length-1; i>=0; i--){
			let t = futTransactions[i];
			if(actualQuantity === quantity){
				if(t.status === 'pending'){
					t.status = 'accepted'
					t.save();
				}
				continue;
			}else{
				if(t.status === 'pending'){
					t.status = 'rejected';
					t.save();
					totalAmount -= (t.credit? 1 : -1)*t.amount;	
					quantity = Math.floor(Math.abs(totalAmount/1000));	
				}
			}				
		}

	}


	res.status(200).json(jsonHelper.getResponse("Success",null,{data : []}));
};