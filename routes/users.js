var express = require('express');
var router = express.Router();
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

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
  if(req.file){
    avatar = req.file
  }else{
    // Set default image
    avatar = 'noimage.png'
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
  console.log(errors);
  if(errors){
    res.render('users/register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password_confirmation: password_confirmation
    })
  }else{
    // var newUser = new User({
    //   name: name,
    //   email: email,
    //   username: username,
    //   password: password,
    //   avatar: avatar
    // });
    // // Create user
    // User.createUser(newUser, function(err, user){
    //   if(err) throw err;
    //   console.log(user);
    // })

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


module.exports = router;
