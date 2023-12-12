const User = require("../models/user");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const queue = require('../config/kue');
const userEmailWorker = require('../workers/user_email_worker');

// module.exports.actionName=function(req,res){}


//render the sign up page
module.exports.signUp = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }else{
  return res.render("user_sign_up", {
    title: "codeial || signUp",
  });
}
};

//render the sign in page
module.exports.signIn = function (req, res) {
  if(req.isAuthenticated()){
    return res.redirect('/users/profile');
  }else{
  return res.render("user_sign_in", {
    title: "codeial || signIn",
  });
}
};

// get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password !== req.body.confirm_password) {
    return res.redirect("back");
  }

  User.findOne({ email: req.body.password }).then((user) => {
    if (!user) {
      User.create(req.body).then((user) => {
        console.log(user);
        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

// sign in data and create session for the user
module.exports.createSession = function (req, res) {
  return res.redirect('/');
};

module.exports.destroySession = function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}

module.exports.resetPassword = function(req, res)
{
    return res.render('reset_password',
    {
        title: 'Reset Password',
        access: false
    });
}

module.exports.resetPassMail = function(req, res)
{
    User.findOne({email: req.body.email}).then( function(user)
    {
       
        if(user)
        {
            if(user.isTokenValid == false)
            {
                user.accessToken = crypto.randomBytes(30).toString('hex');
                user.isTokenValid = true;
                user.save();
                console.log('is email visible');
            }

            let job = queue.create('user-emails', user).save(function(err)
            {
                if(err)
                {
                    console.log('Error in sending to the queue', err);
                    return;
                }
                // console.log('Job enqueued', job.id);
            });

            return res.redirect('/');
        }
        else
        {
            return res.redirect('back');
        }
    });
}

module.exports.setPassword = function(req, res)
{
    User.findOne({accessToken: req.params.accessToken}).then(function(user)
    {
        if(user.isTokenValid)
        {
            return res.render('reset_password',
            {
                title: 'Reset Password',
                access: true,
                accessToken: req.params.accessToken
            });
        }
        else
        {
            return res.redirect('/users/reset-password');
        }
    });
}

module.exports.updatePassword = function(req, res)
{
    User.findOne({accessToken: req.params.accessToken}).then(function( user)
    {
        
        if(user.isTokenValid)
        {
            if(req.body.newPass == req.body.confirmPass)
            {
                user.password = req.body.newPass;
                user.isTokenValid = false;
                user.save();
                return res.redirect('/users/sign-in') 
            }
            else
            {
                return res.redirect('back');
            }
        }
        else
        {
            return res.redirect('/users/reset-password');
        }
    });
}