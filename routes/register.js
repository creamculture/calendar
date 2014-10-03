exports.registerNewUser = function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userPassword = req.body.password;

    // Set our collection
    var collection = db.get('users');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "password" : userPassword
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        }
		else{
			res.send("Great Success");
			//res.redirect("/");
		}

    });
};

exports.renderRegPage = function(req, res) {
    res.render('register', { title: 'New User Signup' });
};

