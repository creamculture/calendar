exports.login = function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var username = req.body.username;
    var userPassword = req.body.password;

    // Set our collection
    var collection = db.get('users');

    // Submit to the DB
    collection.find({
        "username" : username,
        "password" : userPassword
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("DB_FAIL");
        }
		else{
			if( doc.length==0 )
				res.send("LOGIN_FAIL");
			//Send user to their home dashboard
			else{
                req.session.username = doc[0].username;
                res.send("SUCCESS");
            }
		}

    });
};