//Server-side

exports.renderUserDashboard = function(req, res) {
    if( req.session.username )
        res.render('user_dashboard', {"username": req.session.username});
    else
        res.send("FORBIDDEN!");
};

//Update user doc in DB with this newly created event
function updateUserInfo(req, idStr){
    var userCollection = req.db.get("users");
    userCollection.update(
       { username: req.session.username },
       { $push: { eventsCreated: idStr } }
    );
}

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
    	"description" : description,
        "attendees" : [ req.session.username ]
    	}, function (err, doc) {
			if (err) 
				res.send("There was a problem adding an event to the database.");
			else{
                updateUserInfo(req, doc._id);
				res.send("Event successfully added to DB");
            }
    	}
    );


};

//Called by calendar to populate with events
exports.getEvents = function(req, res){

    var eventsCollection = req.db.get("events");

    eventsCollection.find( {}, function(err, doc){
        res.send( doc );
    });

};