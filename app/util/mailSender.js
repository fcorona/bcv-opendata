var nodemailer = require('nodemailer'),
    jade = require('jade');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport('SMTP',{
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// setup e-mail data with unicode symbols
var mailOptions = {
  from: 'Desarroladores bogotacomovamos <desarrolladores@bogotacomovamos.org>',
  subject: 'Hello',
  text: 'Hello world'
};

var path = 'app/views/mailTemplates/';
var TEMPLATES = {
  ACTIVE_ACCOUNT: path + 'activeAccount.jade'
};


module.exports.sendMail = function(user, template, message){
  mailOptions.to = user.email;
  mailOptions.subject = 'Activa tu cuenta de desarrollador del bogotacomovamos'
  mailOptions.html = jade.renderFile(TEMPLATES[template], {user: user, title: 'Activa tu cuenta'});
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log('Message sent: ' + response.message);
    }
    smtpTransport.close(); // shut down the connection pool, no more messages
  });
};