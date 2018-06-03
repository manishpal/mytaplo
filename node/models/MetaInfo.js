const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const metaInfoSchema = new Schema({
    
})

metaInfoSchema.plugin(timestamps);
module.exports = mongoose.model('MetaInfo', metaInfoSchema);