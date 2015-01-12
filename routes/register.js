//Server-side

exports.registerNewUser = function(req, res) {
	var log4js = require( "log4js" );
	log4js.configure("./config/log4js.json");
	var logger = log4js.getLogger('info');

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var email = req.body.email;
    var userPassword = req.body.password;

    // Set our collection
    var collection = db.get('users');
    //var theUrl = url.parse( req.url );

        // gets the query part of the URL and parses it creating an object
    //var queryObj = queryString.parse( theUrl.query );

        // queryObj will contain the data of the query as an object
        // and jsonData will be a property of it
        // so, using JSON.parse will parse the jsonData to create an object
    //var obj = JSON.parse( queryObj );

	//var x = {"firstName":"f","lastName":"derp","email":"khuang@email.wm.edu","password":"e"};

    // Submit to the DB
    collection.insert({
        "email" : email,
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

