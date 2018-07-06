const mongoose = require('mongoose');
const transactionModel = mongoose.model('Transaction');
const jsonHelper = require('../utils/getResponseController');

exports.createTransaction = async (req,res) => {
	console.log("req.body is", req.body);
    //const blogsData = await transactionModel.create({});
    res.status(200).json(jsonHelper.getResponse("Success",null,{}));
}