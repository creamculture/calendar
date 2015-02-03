//Server-side

exports.renderCalendarPage = function(req, res) {
	if( req.session.username )
    	res.render('calendar');
    else
    	res.send("FORBIDDEN!");
};

//Takes event from client and updates user with new attending event
exports.attendCalendarEvent = function(req, res) {
	var userCollection = req.db.get("users");
    userCollection.update(
       { username: req.session.username },
       { $push: { eventsAttending: req.body.id } }, function(err, doc){
       		if( err )
       			res.send("Failure updating user with new event attending");
       		else
       			res.send("User successfully updated with new event attending");
       }
    );
};