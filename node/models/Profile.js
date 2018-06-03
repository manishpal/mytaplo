const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const profileSchema = new Schema({
    facebookId : {
        type:String
    },
    name : {
        type:String
    },
    email : {
        type: String,
        lowercase: true,
        trim: true
    },
    accessToken : {
        type : String
    },
    pages : [
        {
        type : Schema.Types.ObjectId,
        ref : 'Page'
        }
    ]
    
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals:true}
}
);

profileSchema.plugin(timestamps);
module.exports = mongoose.model('Profile', profileSchema);