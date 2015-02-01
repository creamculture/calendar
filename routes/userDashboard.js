//Server-side

exports.renderUserDashboard = function(req, res) {
    if( req.session.username )
        res.render('user_dashboard', {"username": req.session.username});
    else
        res.send("FORBIDDEN!");
};

// Deserializes and saves in DB the form sent from client
exports.saveNewEvent = function(req, res) {
	var name = req.body.eventName;
	var address = req.body.eventAddr;
	var city = req.body.eventCity;
	var startDate = req.body.startDate;
    var endDate = req.body.endDate;
	var description = req.body.eventDesc;

    var eventsCollection = req.db.get("events");

    eventsCollection.insert({
    	"name" : name,
    	"address" : address,
    	"city" : city,
    	"startDate" : startDate,
        "endDate" : endDate,
    	"description" : description
    	}, function (err, doc) {
			if (err) 
				res.send("There was a problem adding an event to the database.");
			else
				res.send("Event successfully added to DB");
    	}
    );

    //Update user collection with this newly created event
};

//Called by calendar to populate with events
exports.getEvents = function(req, res){

    var eventsCollection = req.db.get("events");

    eventsCollection.find( {}, function(err, doc){
        res.send( doc );
    });

};