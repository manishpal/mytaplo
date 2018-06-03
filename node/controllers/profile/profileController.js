const mongoose = require('mongoose');
const {FB, FacebookApiException} = require('fb');
const jsonHelper = require('../../controllers/utils/getResponseController');
const fbHelper = require('../../controllers/utils/facebookApiController');

exports.addAccount = (req,res) => {
    const userAccessToken = req.body.token || '';
    if(userAccessToken != '') {
        fbHelper.getProfile(userAccessToken, function(err,userData){
            if(err) {
                console.error(err);
                res.status(500).json(jsonHelper.getResponse("Failure",err,null))
                return;
            }
            console.log(userData.facebookId);
            fbHelper.getPages(userAccessToken,userData.facebookId, function(err,pagesData){
                if(err) {
                    console.error(err);
                    res.status(500).json(jsonHelper.getResponse("Failure",err,null))
                    return;
                }
                res.status(200).json(jsonHelper.getResponse("Success",null,{"facebookId":userData.facebookId}));
            })
        })
    } else {
        res.status(500).json(jsonHelper.getResponse("Failure",new Error("User Access Toekn is Needed"),null));
    }
}