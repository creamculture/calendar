//Server-side
exports.registerNewUser = function(req, res) {
	var log4js = require( "log4js" );
	log4js.configure("./config/log4js.json");
	var logger = log4js.getLogger('info');

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var username = req.body.username;
    var email = req.body.email;
    var userPassword = req.body.password;

    // Set our collection
    var collection = db.get('users');


    // Submit to the DB
    collection.insert({
        "username" : username,
        "email" : email,
        "password" : userPassword
		}, function (err, doc) {
			if (err) {
				res.send("There was a problem registering to the database.");
			}
			else{
        //copy users profile picture
        var mkdirp = require('mkdirp');
        mkdirp('./public/images/profile', function(err) {
          var fs = require('fs');
          fs.createReadStream('./public/images/userface.jpg').pipe(fs.createWriteStream('./public/images/profile/' + username));

          res.render("welcome_login");
        });
			}
    });
};

exports.renderRegPage = function(req, res) {
    res.render('register', { title: 'New User Signup' });
};

