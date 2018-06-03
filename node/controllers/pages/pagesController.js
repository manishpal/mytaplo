const mongoose = require('mongoose');
const profileModel = mongoose.model('Profile');
const jsonHelper = require('../utils/getResponseController');

exports.getPages = async (req,res) => {
    const facebookId = req.query.facebookId || '';
    const profileData = await profileModel.findOne({facebookId : facebookId}).populate('pages');
    res.status(200).json(jsonHelper.getResponse("Success",null,profileData.pages));
}