const nodeMailer = require('../config/nodemailer');

exports.newComment = (comment) => {

    let htmlString = nodeMailer.renderTemplate({comment: comment} , "/comments/new_comment.ejs");
    console.log('Inside newComment Mailer');
    
    nodeMailer.transporter.sendMail({
        from: 'jigrani0000@gmail.com',
        to: comment.user.email,
        subject: "New comment published!",
        html: htmlString
    }, (err, info) =>
    {
        if(err)
        {
            console.log('Error in sending mail', err);
            return;
        }
        return;
    })
}