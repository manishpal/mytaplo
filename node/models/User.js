const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const userSchema = new Schema({
    userId : {
        type : String,
        unique : true,
        index : true
    },
    name : {
        type:String
    },
    email : {
        type: String,
        lowercase: true,
        trim: true,
    },
    password : {
        type : String
    },
    accessToken : {
        type : String
    }    
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
});

userSchema.plugin(timestamps);
module.exports = mongoose.model('User', userSchema);