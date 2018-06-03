const {FB, FacebookApiException} = require('fb');
const mongoose = require('mongoose');
const profileModel = mongoose.model('Profile');
const pageModel = mongoose.model('Page');

// Getting Profile from Facebook API with accessToken and saving the data to the Profile Collection
exports.getProfile = (userAccessToken,cb) => {
    FB.api('me', {fields : ['email','name','id'],access_token : userAccessToken}, async function(userData){
        if(!userData || userData.error) {
            return cb(new Error(" Error in Response while retreiving User Information"),null);
        }
        const profileData = {"facebookId": userData.id || '', "name" : userData.name || '',"email" : userData.email || '', "accessToken": userAccessToken};
        const savingProfileData = await profileModel.findOneAndUpdate({"facebookId" : profileData.facebookId},profileData,{upsert:true,new:true});
        if(!savingProfileData) {
            return cb(new Error("Error in saving the Profile Data"),null);
        }
        return cb(null,savingProfileData);
    })
}

// Getting Pages from Facebook API with accessToken and saving the data to the Page Collection
exports.getPages = (userAccessToken,facebookId,cb) => {
    FB.api('me/accounts', {access_token: userAccessToken} ,async function (pagesData) {
        if(!pagesData || pagesData.error) {
            return cb(new Error("Error in Response while retreiving Pages List"),null);
        }

        let pages = [];
        for(let page of pagesData.data) {
            const pageData = {"pageId": page.id,"name":page.name,"pageAccessToken":page.access_token,"category": page.category};
            const savingPageData = await pageModel.findOneAndUpdate({"pageId" : pageData.pageId},pageData,{upsert:true,new:true});
            
            if(!savingPageData) {
                return cb(new Error("Error in adding Pages to the Database"),null);
            }
            
            pages.push(savingPageData);
        }

        const pageIds = pages.map(page => page.id);
        console.log(pageIds);
        const updateProfileForPages = await profileModel.findOneAndUpdate({"facebookId": facebookId}, {$addToSet:{pages:{$each:pageIds}}});
        console.log("Update", updateProfileForPages);
        return cb(null,pages);
    })
}