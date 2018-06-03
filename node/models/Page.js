const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const validator = require('validator');

const pageSchema = new Schema({
    pageId : {
        type : String
    },
    name : {
        type : String
    },
    pageAccessToken : {
        type : String
    },
    category : {
        type : String
    }
    
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
}
);

pageSchema.plugin(timestamps);
module.exports = mongoose.model('Page', pageSchema);