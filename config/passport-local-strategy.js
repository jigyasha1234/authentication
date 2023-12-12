const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
},
  async (req,email, password, done) => {
    try {
      let user = await User.findOne({ email })

      if (!user || user.password !== password) {
        return done(null, false);
      }

      console.log("User Validated!", user);
      return done(null, user);

    } catch (error) {
      console.log("Error in Finding user!!", error);
      return done(err);
    }
  }
));

// Serialize User to decide which key to be kept in Cookie
passport.serializeUser(function (user, done) {
  done(null, user.id)
});

// Desrialize User from the key in cookies
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
    .catch((err) => {
      console.log("Error Finding User!!");
      return done(err);
    });
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  // if the user is not signed in
  return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
  if (req.isAuthenticated()) {
    //req.user contains signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }
  next();
}

module.exports = passport;