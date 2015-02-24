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

exports.uploadProfilePicture = function(req, res){
  //console.log(JSON.stringify(req.files));
  var serverPath = 'images/profile/' + req.files.userPhoto.name;
  var pathToServer = './public/';

  require('fs').rename(
    //userPhoto is the input name
    req.files.userPhoto.path,
    pathToServer + serverPath,
    function(error){
      if(error){
        console.log(error)
        res.send({
          error: 'File uploaded cancelled, error.'
        });
        return;
      }

      res.send({
        path: serverPath
      });
    }
  )

};

exports.cropProfilePicture = function(req, res){
  var gm = require('gm').subClass({ imageMagick: true });
  var resizeX = 400;
  var resizeY = 400;

  var src = req.body.src;
  var name = req.body.name;
  var coords = req.body.data;
  var pathToServer = './public/';

  gm(pathToServer + src).crop(coords.w, coords.h, coords.x, coords.y).resize(resizeX,resizeY).write(pathToServer + 'images/profile/' + req.session.username, function(err){
    if (!err){
      console.log("Image: " + name + " Cropped");
      res.send("success");
    }
    else
    {
      res.send(err);
    }
  })
};