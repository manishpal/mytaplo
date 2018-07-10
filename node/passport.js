'use strict';

var passport = require('passport');
var User = require('mongoose').model('User');
var CustomStrategy = require('passport-custom').Strategy;
var kite = require('./controllers/utils/kite');

module.exports = function () {

    passport.use('zerodha-login', new CustomStrategy(
         async function (req, done) {
            let credentials = await kite.login(req.query.request_token);
            if(credentials && credentials.user_id){
                User.findOne({userId : credentials.user_id}, async function(err, user){
                    if(err) { return done(err)}
                    if(!user) {
                        //We need to create user. this is sign up.
                        user = await User.create({userId : credentials.user_id, 
                                email : credentials.email, 
                                name : credentials.user_name,
                                accessToken : credentials.access_token});

                    }else{
                        user.accessToken = credentials.access_token;
                        user = await user.save();
                    }
                    return done(null, user);
                });
            }else{
                return done(null, false);
            }
            /*User.findOne({email : username}, function(err, user) {
                console.log("got user", user);
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (user.password != password) { return done(null, false); }
                return done(null, user);
            });*/
        }));

    passport.serializeUser(function(user, cb) {
        console.log("got user id", user.id);
        cb(null, user.id);
    });

    passport.deserializeUser(function(id, cb) {
        console.log("finding id", id);
        User.findById(id, function (err, user) {
            if (err) { return cb(err); }
            cb(null, user);
        });
    });

};        