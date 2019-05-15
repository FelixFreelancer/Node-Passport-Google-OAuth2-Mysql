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
const mysql_conf = require('./config/mysql_config');
const google_conf = require('./config/google_config');

const passport = require('passport');
const google_passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

// Access public folder from root
app.use('/public', express.static('public'));
app.get('/layouts/', function(req, res) {
  res.render('view');
});

// DB connect *
const connection = mysql.createConnection({
  host: mysql_conf.HOST,
  user: mysql_conf.USERNAME,
  password: mysql_conf.PASSWORD,
  database: mysql_conf.DATABASE
});
connection.connect((err)=>{
  if(err) throw err;
  console.log('Connected!');
})


// Google oauth Passport Config *
google_passport.use(new GoogleStrategy({
  clientID: google_conf.CLIENTID,
  clientSecret: google_conf.CLIENTSECRET,
  callbackURL: google_conf.CALLBACKURL
},
  function(accessToken, refreshToken, email, cb) {
    cb(null, {'email': email.emails[0].value});
  }
));
google_passport.serializeUser((user, cb) => {
  cb(null, user);
});
google_passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});


// Passport Config *
require('./config/passport')(passport);

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

// Google Passport middleware *
app.use(google_passport.initialize());
app.use(google_passport.session());

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

app.get('/auth/google',
  google_passport.authenticate('google', { scope: ['email'] }));

app.get('/auth/google/callback', 
  google_passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication and check if match with user in mysql database, redirect dashboard.
    connection.query("SELECT * from " + mysql_conf.USERTABLE + " where email='" + req.user.email  + "'", function(err, rows, fields) {
      if(rows.length == 0) {
        res.redirect('/');
      } else {
        res.redirect('/dashboard');
      }
      
    });
    
});
const port = process.env.PORT || 8000;
http.listen(port, function(){
  console.log('listening on *:'+port);
  console.log('Ciao Mondo');
});
