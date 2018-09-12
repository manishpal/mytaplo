const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const brcDataSchema = new Schema({
    iecCode : {
        type : String,
        index : true
    },
    jsonData : String
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
});

brcDataSchema.plugin(timestamps);

module.exports = mongoose.model('BrcData', brcDataSchema);