exports.login = function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var email = req.body.email;
    var userPassword = req.body.password;

    // Set our collection
    var collection = db.get('users');

    // Submit to the DB
    collection.find({
        "email" : email,
        "password" : password
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
		else{
			if( doc.length==0 )
				res.send("Invalid Login");
			else
				res.send("Successfully logged in");
		}

    });
};