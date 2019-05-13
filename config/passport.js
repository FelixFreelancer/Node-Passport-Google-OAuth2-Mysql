const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: '',
    database:'upwork'
    });
connection.connect((err)=>{
    if(err) throw err;
})


module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'name' }, (name, password, done) => {
      // Match user
        connection.query("SELECT * from user where name='" + name  + "'", function(err, rows, fields) {
            if (!err){
                const user = rows[0];
                if(user.password == password) {
                    return done(null, user);
                } else {
                    console.log("password incorrect");
                    return done(null, false, { message: 'Password incorrect' });
                }

            }
            else{
                console.log('Error while performing Query.');
                return done(null, false, { message: 'That email is not registered' });
            }
        });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    connection.query("SELECT * from user where id=" + id , function(err, rows, fields) {
        if (!err){
            const user = rows[0];
            return done(err, user);
        }
        else
            console.log('Error while performing Query.');
    });
  });
};
