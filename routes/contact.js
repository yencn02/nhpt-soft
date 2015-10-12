var express = require('express');
var router = express.Router();
var mailer = require('../models/mailer')

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact'});
});

router.post('/', function(req, res, next){
  // Form validation
  req.checkBody('name', 'Name field is required').notEmpty()
  req.checkBody('email', 'Email field is required').notEmpty()
  req.checkBody('email', 'Email not valid').isEmail()
  req.checkBody('message', 'Message field is required').notEmpty()

  // Check for errors
  var errors = req.validationErrors();
  if(errors){
    res.render('contact', {
      errors: errors,
      title: "Contact",
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    })
  }else{
    mailer.sendContactEmail(req.body, function(error, info){
      if(error){
        console.log(error)
        req.flash('error', 'There were something went wrong. Please try again later.');
        res.redirect('/')
      }else{
        req.flash('success', 'Your message has already been sent to our system admin.')
        res.redirect('/')
      }
    })
  }
});

module.exports = router;
