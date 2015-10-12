var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var User = require('../models/user')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/register', function(req, res, next) {
  res.render('users/register', {
    title: 'Register'
  });
});

router.post('/register', upload.single('avatar'), function(req, res, next) {
  var name = req.body.name, email = req.body.email,
      username = req.body.username, password = req.body.password,
      password_confirmation = req.body.password_confirmation;
  var avatar = null;
  // Check for Image field
  console.log(req.file)
  if(req.file){
    avatar = req.file.name;
  }else{
    // Set default image
    avatar = 'no_image.png'
  }
  // Form validation
  req.checkBody('name', 'Name field is required').notEmpty()
  req.checkBody('email', 'Email field is required').notEmpty()
  req.checkBody('email', 'Email not valid').isEmail()
  req.checkBody('username', 'Username field is required').notEmpty()
  req.checkBody('password', 'Password field is required').notEmpty()
  req.checkBody('password_confirmation', 'Passwords do not match').equals(req.body.password)

  // Check for errors
  var errors = req.validationErrors();
  if(errors){
    res.render('users/register', {
      errors: errors,
      title: "Register",
      name: name,
      email: email,
      username: username,
      password: password,
      password_confirmation: password_confirmation
    })
  }else{
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      avatar: avatar
    });
    // Create user
    User.createUser(newUser, function(err, user){
      console.log(err);
      console.log(user);
      if(err) throw err;
    })

    // Success Message
    req.flash('success', 'You are now registered and may login')
    res.redirect('/')
  }
});

router.get('/login', function(req, res, next) {
  res.render('users/login', {
    title: 'Login'
  });
});

passport.serializeUser(function(user, done){
  done(null, user.id);
})

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(err, user);
  })
})

passport.use(new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err, user){
    if(err) throw err;
    if(!user){
      console.log('Unknown User');
      return done(null, false, {message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        return done(null, user);
      }else{
        console.log('Invalid Password')
        return done(null, false, {message: 'Invalid Password'})
      }
    });
  });
}))

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login', 
  failureFlash: 'Invalid username or password',
  successRedirect: '/',
  successFlash: 'You are logged in'
}), function(req, res){
  console.log('Authentication successful');
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You have logged out')
  res.redirect('/users/login')
});

module.exports = router;
