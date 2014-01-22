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
  ACTIVE_ACCOUNT: {
    file: path + 'activeAccount.jade',
    title: 'Activa tu cuenta',
    subject: 'Activa tu cuenta de desarrollador del bogotacomovamos'
  },
  RECOVER_PASSWORD: {
    file: path + 'recoverPassword.jade',
    title: 'Recupera tu contraseña',
    subject: 'Recuperación de contraseña para tu cuenta'
  }
};


module.exports.sendMail = function(user, template, message){
  template = TEMPLATES[template];
  mailOptions.to = user.email;
  mailOptions.subject = template.subject;
  mailOptions.html = jade.renderFile(template.file, {user: user, title: template.title});
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
    }else{
      console.log('Message sent: ' + response.message);
    }
    smtpTransport.close();
  });
};