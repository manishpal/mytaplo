'use strict';

var passport = require('passport');
var User = require('mongoose').model('User');
var localStrategy = require('passport-local').Strategy;

module.exports = function () {

    passport.use(new localStrategy(
        function (username, password, done) {
            console.log(" got profile from fb", username);
            User.findOne({email : username}, function(err, user) {
                console.log("got user", user);
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (user.password != password) { return done(null, false); }
                return done(null, user);
            });
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