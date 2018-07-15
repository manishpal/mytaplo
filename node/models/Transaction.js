const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const validator = require('validator');
const constants = require('../Constants');
const moment = require('moment');


const transactionSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    currency : {
        type : String
    },
    amount : {
        type : Number
    },
    credit : {
        type : Boolean
    },
    transactionDate : {
        type : Date
    },
    status : {
        type : String,
        default : 'pending',
        enum : ['pending', 'accepted', 'rejected']
    },
    deleted : {
        type: Boolean,
        default: false
    }
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
});

transactionSchema.plugin(timestamps);

transactionSchema.methods.getFutName = function(){
    let yearmonth = moment(this.transactionDate).format("YYMMM").toUpperCase();
    return this.currency+'INR' + yearmonth + 'FUT';
}

module.exports = mongoose.model('Transaction', transactionSchema);