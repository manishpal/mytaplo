const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const validator = require('validator');
const constants = require('../Constants');


const positionSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    positions : {
        type : String
    }
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
});

positionSchema.plugin(timestamps);
module.exports = mongoose.model('Position', positionSchema);