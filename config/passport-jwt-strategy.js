const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user')

let opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'secret',
}
passport.use(new jwtStrategy(opts,function(jwtPayLoad, done){
    User.findById(jwtPayLoad._id).then( function(user){
        if(user){
            return done(null,user);
        }else{
            return done(null, false);
        }
    })
}));
module.exports=passport;