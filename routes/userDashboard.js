//Server-side

exports.renderUserDashboard = function(req, res) {
    res.render('user_dashboard');
};

// Handles the submission of a form containing new event info
exports.saveNewEvent = function(req, res) {
	var name = req.body.eventName;
	var address = req.body.eventAddr;
	var city = req.body.eventCity;
	var date = req.body.eventDate;
	var description = req.body.eventDesc;

    var db = req.db;
    var collection = db.get("events");

    collection.insert({
    	"name" : name,
    	"address" : address,
    	"city" : city,
    	"date" : date,
    	"description" : description
    	}, function (err, doc) {
			if (err) 
				res.send("There was a problem adding an event to the database.");
			else
				res.send("Event successfully added to DB");
    	}
    );
};

exports.getEvents = function(req, res){

    var db = req.db;
    var collection = db.get("events");

    collection.find( function(err, doc){
        //Parse event documents to object that can be return to client and ingested by fullCalendar
    })
};