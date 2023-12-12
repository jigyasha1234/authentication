const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const crypto = require('crypto');
const User = require('../models/user');

// tell passport to use anew strategy for google login
passport.use(new googleStrategy({
    clientID: "931136612294-rfcq9h9kgvodfrjg1furmv6k6fjqvbgr.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
},
function(accessToken, refreshToken, profile, done){
    //find a user
    User.findOne({email: profile.emails[0].value}).exec().then(function(user){
        console.log(profile);
        if(user){
            // if found, set this user as req.user
            return done(null, user);
        }else{
            // if not found, create the user and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function(user){
                return done(null,user);
            }
            );
        }
    })
}

))