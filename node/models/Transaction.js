const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const validator = require('validator');
const constants = require('../Constants');


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
    hedgedPrice : {
        type : String
    },
    deleted : {
        type: Boolean
    }
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
});

transactionSchema.plugin(timestamps);
module.exports = mongoose.model('Transaction', transactionSchema);