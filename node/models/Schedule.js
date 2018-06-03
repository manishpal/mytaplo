const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const scheduleSchema = new Schema({
    
})

scheduleSchema.plugin(timestamps);
module.exports = mongoose.model('Schedule', scheduleSchema);