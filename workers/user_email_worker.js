const queue = require('../config/kue');

const usersMailer = require('../mailers/users_mailer');

queue.process('user-emails', function(job, done)
{
    // User email worker is processing a job (Reset Password)
    usersMailer.resetPassword(job.data);
    done();
});

queue.process('signup-successful', function(job, done)
{
    // User email worker is processing a job (Sign-up)')
    usersMailer.signupSuccess(job.data);
    done();
});