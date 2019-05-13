var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
var bCrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var router = require('./router/router.js');
var Authrouter = require('./router/Authrouter.js');
const cors = require('cors');
const mysql = require('mysql');

const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

var GoogleStrategy = require('passport-google-oauth20').Strategy;


// Access public folder from root
app.use('/public', express.static('public'));
app.get('/layouts/', function(req, res) {
  res.render('view');
});

// Google oauth Passport Config *
passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: "http://www.example.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// Passport Config *
require('./config/passport')(passport);

// DB connect *
const connection = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password: '',
  database:'upwork'
});
connection.connect((err)=>{
  if(err) throw err;
  console.log('Connected!');
})


// Add Authentication Route file with app
app.use('/', Authrouter);

//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Express body parser *
app.use(express.urlencoded({ extended: true }));

// Express session *
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware *
app.use(passport.initialize());
app.use(passport.session());

// Connect flash *
app.use(flash());

// Global variables *
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Add Route file with app
app.use('/', router); 
const port = process.env.PORT || 8000;
http.listen(port, function(){
  console.log('listening on *:'+port);
  console.log('Ciao Mondo');
});
