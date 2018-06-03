const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const validator = require('validator');
const constants = require('../Constants');


const blogSchema = new Schema({
    title : {
        type : String
    },
    url : {
        type : String
    },
    imageUrl : {
        type : String
    },
    language : {
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

blogSchema.plugin(timestamps);
module.exports = mongoose.model('Blog', blogSchema);