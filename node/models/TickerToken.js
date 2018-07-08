const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    accessToken : {
        type : String,
    }
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
});

module.exports = mongoose.model('TickerToken', tokenSchema);