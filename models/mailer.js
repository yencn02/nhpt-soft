var nodemailer = require('nodemailer')
var senderEmail = process.env.SENDER_EMAIL || "yencn02@gmail.com";
var senderPassword = process.env.SENDER_PASSWORD || "something";

var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth:{
    user: senderEmail,
    pass: senderPassword
  }
});

module.exports.sendContactEmail = function(options, callback){
  var mailOptions = {
    from: options.name + ' via NHTP Soft <'+options.email+'>',
    to: senderEmail,
    subject: '[NHTP Soft] Website Submission',
    text: 'You have a new submission with the following details...Name: ' + options.name+ ' Email: ' + options.email +' Message: ' + options.message,
    html: '<p>You have a new submission with the following details</p><ul><li>Name: ' +options.name+ '</li><li>Email: ' +options.email+ '</li><li>Message: ' + options.message+ '</li></ul>'
  }
  transporter.sendMail(mailOptions, function(error, info){
    callback(error, info)
  })
}